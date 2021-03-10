module "lambda_function_list_ingress" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "list-ingress"
  description   = "Function to list ingress results"
  handler       = "index.listIngress"
  runtime       = "nodejs14.x"

  tags = {
    Owner = "pft-extractor"
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/list-ingress"
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

  source_path = "${path.module}/src/request/dist"
  # source_path = [
  #   {
  #     path = "${path.module}/src/api"
  #     commands = [
  #       "npm run build",
  #       "cd dist",
  #       ":zip"
  #     ]
  #   }
  # ]
}

module "lambda_function_list_egress" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "list-egress"
  description   = "Function to list egress results"
  handler       = "index.listEgress"
  runtime       = "nodejs14.x"

  tags = {
    Owner = "pft-extractor"
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/list-egress"
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

  // @TODO
  source_path = "${path.module}/src/request/dist"
  # source_path = [
  #   {
  #     path = "${path.module}/src/api"
  #     commands = [
  #       "npm run build",
  #       "cd dist",
  #       ":zip"
  #     ]
  #   }
  # ]
}

module "lambda_function_prepare_ingress" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "prepare-ingress"
  description   = "Function to create a signed url for documents to be added to ingress"
  handler       = "index.prepareIngress"
  runtime       = "nodejs14.x"

  tags = {
    Owner = "pft-extractor"
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
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  // @TODO
  source_path = "${path.module}/src/request/dist"
  # source_path = [
  #   {
  #     path = "${path.module}/src/api"
  #     commands = [
  #       "npm run build",
  #       "cd dist",
  #       ":zip"
  #     ]
  #   }
  # ]
}

module "lambda_function_egress_result" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "egress-result"
  description   = "Function to return the end result of the transformation process"
  handler       = "index.egressResult"
  runtime       = "nodejs14.x"

  tags = {
    Owner = "pft-extractor"
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/egress/*"
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
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  // @TODO
  source_path = "${path.module}/src/request/dist"
}

module "lambda_function_interpretation" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "interpretation"
  description   = "Function to return the end result of the interpretation process"
  handler       = "index.interpretation"
  runtime       = "nodejs14.x"

  tags = {
    Owner = "pft-extractor"
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
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  // @TODO
  source_path = "${path.module}/src/request/dist"
}

module "lambda_function_authorizer" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "authorize"
  description   = "Function to authorize requests to client api gateway"
  handler       = "index.handler"
  runtime       = "nodejs14.x"

  tags = {
    Owner = "pft-extractor"
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/authorizers/${aws_apigatewayv2_authorizer.client_api_authorizer.id}"
    }
  }

  source_path = [
    {
      path = "${path.module}/src/authorize"
      commands = [
        "npm run build",
        "cd dist",
        ":zip"
      ]
    }
  ]
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
    "GET /list-ingress" = {
      lambda_arn             = module.lambda_function_list_ingress.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "CUSTOM"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    },
    "GET /list-egress" = {
      lambda_arn             = module.lambda_function_list_egress.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "CUSTOM"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    },
    "POST /prepare-ingress" = {
      lambda_arn             = module.lambda_function_prepare_ingress.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "CUSTOM"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    },
    "GET /egress/{key}" = {
      lambda_arn             = module.lambda_function_egress_result.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "CUSTOM"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    },
    "GET /interpretation/{key}" = {
      lambda_arn             = module.lambda_function_interpretation.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorization_type     = "CUSTOM"
      authorizer_id          = aws_apigatewayv2_authorizer.client_api_authorizer.id
    }
  }

  tags = {
    Owner = "pft-extractor"
  }
}

# @NOTE  Not supported by AWS Terraform module yet
## Therefore, must be manually attached in console... not great, to revisit
resource "aws_apigatewayv2_authorizer" "client_api_authorizer" {
  api_id                            = module.client_api.this_apigatewayv2_api_id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = module.lambda_function_authorizer.this_lambda_function_invoke_arn
  identity_sources                  = ["$request.header.Authorization"]
  name                              = "client-api-authorizer"
  enable_simple_responses           = true
  authorizer_payload_format_version = "2.0"
}

resource "aws_cloudwatch_log_group" "client_api_log_group" {
  name = "/aws/api-gateway/client-api"
}