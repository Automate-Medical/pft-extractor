import * as sst from "@serverless-stack/resources";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers";
import { ApiAuthorizationType } from "@serverless-stack/resources";
import { PolicyStatement, Effect, Role, ServicePrincipal, PolicyDocument, AccountRootPrincipal } from "@aws-cdk/aws-iam"
import { UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { LogGroup } from "@aws-cdk/aws-logs";
import { Key } from "@aws-cdk/aws-kms";
import { HttpMethods, EventType, BucketEncryption } from "@aws-cdk/aws-s3"
import { RemovalPolicy } from "@aws-cdk/core";

export default class PFTX extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    //////////////////////////////
    // Cognito User Pool (Auth) //
    //////////////////////////////

    const userPool = new UserPool(this, "UserPool", {
      selfSignUpEnabled: false,
      signInAliases: {
        email: true
      },
      signInCaseSensitive: false
    });

    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool,
      authFlows: { userPassword: false, userSrp: true, custom: true },
      generateSecret: false
    });

    /////////
    // IAM //
    /////////

    const TextractServiceRole = new Role(this, "TextractServiceRole", {
      roleName: "textract-service-role",
      inlinePolicies: {
        SNS: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ["sns:Publish"],
              effect: Effect.ALLOW,
              resources: ["arn:aws:sns:*:*:*AmazonTextract*"],
            })
          ]
        })
      },
      assumedBy: new ServicePrincipal("textract.amazonaws.com"),
    });

    ///////////////////////////
    // KMS - Encryption keys //
    ///////////////////////////

    const kmsObjectsKey = new Key(this, "objects", {
      description: "KMS key is used to encrypt *-bucket objects",
      // @sec-todo is this an appropriate key policy?
      policy: new PolicyDocument({
        assignSids: true,
        statements: [
          new PolicyStatement({
            actions: ["kms:*"],
            effect: Effect.ALLOW,
            principals: [new AccountRootPrincipal()],
            resources: ["*"],
          })
        ]
      })
    })

    /////////////////////
    // DynamoDB Tables //
    /////////////////////

    const DynamoTableExtracts = new sst.Table(this, "Extracts", {
      fields: {
        ID: sst.TableFieldType.STRING
      },
      primaryIndex: { partitionKey: "ID" },
      dynamodbTable: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
    });

    //////////////////
    // Topics (SNS) //
    //////////////////

    const TextractJobCompleted = new sst.Topic(this, "AmazonTextract-pft-extractor-job-completed", {
      snsTopic: {
        displayName: "pft-extractor-job-completed"
      }
    });

    ////////
    // S3 //
    ////////

    // @TODO log
    // @TODO public access? <- write only?

    const bucket = new sst.Bucket(this, "pft-x-bucket", {
      s3Bucket: {
        encryption: BucketEncryption.KMS,
        encryptionKey: kmsObjectsKey,
        enforceSSL: true,
        versioned: true,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        // accessControl: BucketAccessControl.PRIVATE, // @sec-todo
        // bucketKeyEnabled: false, // @sec-todo
      },
      notifications: [
        {
          function: new sst.Function(this, "Ingress", {
            handler: "src/ingress/index.handler",
            description: "Ingress function to call Textract on new PFTs being uploaded",
            environment: {
              SNS_TOPIC_ARN: TextractJobCompleted.snsTopic.topicArn,
              ROLE_ARN: TextractServiceRole.roleArn,
              DYNAMODB_TABLE: DynamoTableExtracts.dynamodbTable.tableName
            }
          }),
          notificationProps: {
            events: [EventType.OBJECT_CREATED],
            filters: [{ prefix: "ingress/" }]
          }
        },
        {
          function: new sst.Function(this, "Structure", {
            handler: "src/structure/index.handler",
            description: "Function to transform Textract results into a normalized structure",
            environment: {
              DYNAMODB_TABLE: DynamoTableExtracts.dynamodbTable.tableName
            }
          }),
          notificationProps: {
            events: [EventType.OBJECT_CREATED_PUT],
            filters: [{ prefix: "save-textract-output/" }]
          }
        },
        {
          function: new sst.Function(this, "Interpret", {
            handler: "src/interpret/index.handler",
            description: "Function to provide an automated interpretation of a normalized PFT",
          }),
          notificationProps: {
            events: [EventType.OBJECT_CREATED_PUT],
            filters: [{ prefix: "egress/" }]
          }
        }
      ]
    });

    bucket.attachPermissionsToNotification(0, [
      new PolicyStatement({
        actions: ["textract:StartDocumentAnalysis"],
        effect: Effect.ALLOW,
        resources: ["*"],
      }),
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/ingress/*`],
      }),
      new PolicyStatement({
        actions: ["kms:Decrypt", "kms:DescribeKey"],
        effect: Effect.ALLOW,
        resources: [kmsObjectsKey.keyArn],
      }),
      new PolicyStatement({
        actions: ["dynamodb:UpdateItem"],
        effect: Effect.ALLOW,
        resources: [DynamoTableExtracts.dynamodbTable.tableArn],
      })
    ]);

    bucket.attachPermissionsToNotification(1, [
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/save-textract-output/*`],
      }),
      new PolicyStatement({
        actions: ["s3:PutObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/egress/*`],
      }),
      new PolicyStatement({
        actions: ["kms:Decrypt", "kms:DescribeKey", "kms:GenerateDataKey"],
        effect: Effect.ALLOW,
        resources: [kmsObjectsKey.keyArn],
      }),
      new PolicyStatement({
        actions: ["dynamodb:UpdateItem"],
        effect: Effect.ALLOW,
        resources: [DynamoTableExtracts.dynamodbTable.tableArn],
      })
    ]);

    bucket.attachPermissionsToNotification(2, [
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/egress/*`],
      }),
      new PolicyStatement({
        actions: ["s3:PutObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/interpretation/*`],
      }),
      new PolicyStatement({
        actions: ["kms:Decrypt", "kms:DescribeKey", "kms:GenerateDataKey"],
        effect: Effect.ALLOW,
        resources: [kmsObjectsKey.keyArn],
      })
    ]);

    bucket.s3Bucket.addCorsRule({
      allowedMethods: [HttpMethods.PUT, HttpMethods.POST, HttpMethods.GET],
      allowedOrigins: ["*"], // @todo
      allowedHeaders: ["*"], // @todo,
      exposedHeaders: [],
      maxAge: 3000
    })

    ////////////////
    // CloudWatch //
    ////////////////

    const clientAPILogGroup = new LogGroup(this, "clientAPILogGroup")

    //////////////////////////////////////////////
    // API Gateway (Lambda + JWT Authorization) //
    //////////////////////////////////////////////

    const api = new sst.Api(this, "clientAPI", {
      routes: {
        "GET /extract": {
          function: {
            description: "Function to list all Extracts",
            handler: "src/api/routes/ExtractIndex.handler",
            environment: { DYNAMODB_TABLE: DynamoTableExtracts.dynamodbTable.tableName },
          },
        },
        "POST /extract/new": {
          function: {
            description: "Function to create a signed url for a new Extract to be submitted",
            handler:"src/api/routes/ExtractNew.handler",
            environment: { DYNAMODB_TABLE: DynamoTableExtracts.dynamodbTable.tableName },
          },
        },
        "GET /extract/{key}": {
          function: {
            description: "Function to return the end result of the transformation process",
            handler: "src/api/routes/ExtractGet.handler",
            environment: { DYNAMODB_TABLE: DynamoTableExtracts.dynamodbTable.tableName },
          }
        },
        "GET /interpretation/{key}": {
          function: {
            description: "Function to provide an automated interpretation of a normalized PFT",
            handler: "src/api/routes/InterpretationGet.handler"
          }
        }
      },
      accessLog: {
        destinationArn: clientAPILogGroup.logGroupArn,
        format: "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"
      },
      defaultFunctionProps: {
        timeout: 20,
        environment: { S3_BUCKET: bucket.s3Bucket.bucketName },
      },
      defaultAuthorizationType: ApiAuthorizationType.JWT,
      defaultAuthorizer: new HttpUserPoolAuthorizer({
        userPool,
        userPoolClient
      }),
      defaultPayloadFormatVersion: sst.ApiPayloadFormatVersion.V2,
      cors: {
        allowHeaders: ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST],
        allowOrigins: ["*"]
      }
    });

    //////////////////////////////
    // IAM Policies for Lambdas //
    //////////////////////////////

    api.attachPermissionsToRoute("GET /extract", [
      new PolicyStatement({
        actions: ["s3:ListBucket"],
        effect: Effect.ALLOW,
        resources: [bucket.s3Bucket.bucketArn],
      }),
      new PolicyStatement({
        actions: ["dynamodb:Scan"],
        effect: Effect.ALLOW,
        resources: [DynamoTableExtracts.dynamodbTable.tableArn],
      })
    ]);

    api.attachPermissionsToRoute("POST /extract/new", [
      new PolicyStatement({
        actions: ["s3:PutObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/ingress/*`],
      }),
      new PolicyStatement({
        actions: ["kms:GenerateDataKey"],
        effect: Effect.ALLOW,
        resources: [kmsObjectsKey.keyArn],
      }),
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        effect: Effect.ALLOW,
        resources: [DynamoTableExtracts.dynamodbTable.tableArn],
      })
    ]);

    api.attachPermissionsToRoute("GET /extract/{key}", [
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/egress/*`, `${bucket.s3Bucket.bucketArn}/ingress/*`]
      }),
      new PolicyStatement({
        actions: ["kms:Decrypt"],
        effect: Effect.ALLOW,
        resources: [kmsObjectsKey.keyArn],
      }),
      new PolicyStatement({
        actions: ["dynamodb:GetItem"],
        effect: Effect.ALLOW,
        resources: [DynamoTableExtracts.dynamodbTable.tableArn],
      })
    ]);

    api.attachPermissionsToRoute("GET /interpretation/{key}", [
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/interpretation/*`]
      }),
      new PolicyStatement({
        actions: ["kms:Decrypt"],
        effect: Effect.ALLOW,
        resources: [kmsObjectsKey.keyArn],
      })
    ]);

    //////////////////////
    // Lambda Functions //
    //////////////////////

    const scan = new sst.Function(this, "Scan", {
      handler: "src/scan/index.handler",
      description: "Function to save and store Textract Job results",
      environment: {
        S3_BUCKET: bucket.s3Bucket.bucketName,
        DYNAMODB_TABLE: DynamoTableExtracts.dynamodbTable.tableName
      }
    });

    scan.attachPermissions([
      new PolicyStatement({
        actions: ["textract:GetDocumentAnalysis"],
        effect: Effect.ALLOW,
        resources: ["*"],
      }),
      new PolicyStatement({
        actions: ["s3:PutObject"],
        effect: Effect.ALLOW,
        resources: [`${bucket.s3Bucket.bucketArn}/save-textract-output/*`],
      }),
      new PolicyStatement({
        actions: ["kms:GenerateDataKey"],
        effect: Effect.ALLOW,
        resources: [kmsObjectsKey.keyArn],
      }),
      new PolicyStatement({
        actions: ["dynamodb:UpdateItem"],
        effect: Effect.ALLOW,
        resources: [DynamoTableExtracts.dynamodbTable.tableArn],
      })
    ])

    TextractJobCompleted.addSubscribers(this, [scan]);

    /////////////////
    // CDK Outputs //
    /////////////////
    this.addOutputs({
      "ApiEndpoint": api.httpApi.apiEndpoint,
      "UserPoolId": userPool.userPoolId,
      "userPoolClientId": userPoolClient.userPoolClientId,
      "extractTableArn": DynamoTableExtracts.dynamodbTable.tableArn,
      "s3BucketArn": bucket.s3Bucket.bucketArn
    });
  }
}
