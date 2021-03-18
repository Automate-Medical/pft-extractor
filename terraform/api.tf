module "lambda_function_list_documents" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "list-documents"
  description   = "Function to list all results"
  handler       = "index.listDocuments"
  runtime       = "nodejs14.x"

  tags = {
    Product = var.deployment_name
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/extract/list"
    }
  }

  attach_policy_statements = true
  policy_statements = {
    s3ListBucket = {
      effect    = "Allow",
      actions   = ["s3:ListBucket"],
      resources = [module.s3_bucket.this_s3_bucket_arn]
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  source_path = "${path.module}/../src/request/dist"
}

module "lambda_function_prepare_ingress" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "prepare-ingress"
  description   = "Function to create a signed url for documents to be added to ingress"
  handler       = "index.prepareIngress"
  runtime       = "nodejs14.x"

  tags = {
    Product = var.deployment_name
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/prepare-ingress"
    }
  }

  attach_policy_statements = true
  policy_statements = {
    s3PutObject = {
      effect    = "Allow",
      actions   = ["s3:PutObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/ingress/*"]
    }
    kmsEncrypt = {
      effect    = "Allow",
      actions   = ["kms:GenerateDataKey"]
      resources = [aws_kms_key.objects.arn]
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  source_path = "${path.module}/../src/request/dist"
}

module "lambda_function_egress_result" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "egress-result"
  description   = "Function to return the end result of the transformation process"
  handler       = "index.egressResult"
  runtime       = "nodejs14.x"

  tags = {
    Product = var.deployment_name
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/extract/result/*"
    }
  }

  attach_policy_statements = true
  policy_statements = {
    s3GetEgressObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/egress/*"]
    },
    s3GetIngressObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/ingress/*"]
    },
    kmsDecrypt = {
      effect    = "Allow",
      actions   = ["kms:Decrypt"],
      resources = [aws_kms_key.objects.arn]
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  source_path = "${path.module}/../src/request/dist"
}

module "lambda_function_interpretation" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "interpretation"
  description   = "Function to return the end result of the interpretation process"
  handler       = "index.interpretation"
  runtime       = "nodejs14.x"

  tags = {
    Product = var.deployment_name
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/interpretation/*"
    }
  }

  attach_policy_statements = true
  policy_statements = {
    s3GetInterpretationObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/interpretation/*"]
    },
    kmsDecrypt = {
      effect    = "Allow",
      actions   = ["kms:Decrypt"],
      resources = [aws_kms_key.objects.arn]
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  source_path = "${path.module}/../src/request/dist"
}

module "client_api" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "0.10.0"

  name          = "client-api"
  description   = "A gateway for the X client"
  protocol_type = "HTTP"

  // @TODO lock down
  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.client_api_log_group.arn
  // @TODO - is this maximal logging?
  default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  create_api_domain_name = false

  # Routes and integrations
  integrations = {
    "GET /extract/list" = {
      lambda_arn             = module.lambda_function_list_documents.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "JWT"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    },
    "POST /prepare-ingress" = {
      lambda_arn             = module.lambda_function_prepare_ingress.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "JWT"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    },
    "GET /extract/result/{key}" = {
      lambda_arn             = module.lambda_function_egress_result.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "JWT"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    },
    "GET /interpretation/{key}" = {
      lambda_arn             = module.lambda_function_interpretation.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "JWT"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    }
  }

  tags = {
    Product = var.deployment_name
  }
}

resource "aws_apigatewayv2_authorizer" "client_api_authorizer" {
  api_id                            = module.client_api.this_apigatewayv2_api_id
  authorizer_type                   = "JWT"
  identity_sources                  = ["$request.header.Authorization"]
  name                              = "client-api-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.client_user_pool_client.id]
    issuer   = "https://${aws_cognito_user_pool.client_user_pool.endpoint}"
  }
}

resource "aws_cloudwatch_log_group" "client_api_log_group" {
  name = "/aws/api-gateway/client-api"
}

resource "aws_cognito_user_pool" "client_user_pool" {
  name = "${var.deployment_name}-user-pool"

  admin_create_user_config {
    allow_admin_create_user_only = true
  }
}

resource "aws_cognito_user_pool_client" "client_user_pool_client" {
  name = "web-client"

  generate_secret = false
  user_pool_id = aws_cognito_user_pool.client_user_pool.id
}