module "s3_bucket_ingress" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "pft-extractor-ingress"
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = false
  }

  tags = {
    Owner = "pft-extractor"
  }

  // @TODO log

  cors_rule = [
    {
      allowed_methods = ["PUT", "POST", "GET"]
      allowed_origins = ["*"] // @TODO
      allowed_headers = ["*"]
      expose_headers  = []
      max_age_seconds = 3000
    }
  ]
}

// @TODO permissions, lifecycle, etc
module "s3_bucket_textract_output" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "pft-extractor-textract-output"
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = false
  }

  tags = {
    Owner = "pft-extractor"
  }
}

module "s3_bucket_egress" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "pft-extractor-egress"
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = false
  }

  tags = {
    Owner = "pft-extractor"
  }
}

module "lambda_function_save_textract_output" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "save-textract-output"
  description   = "Function to save and store Textract Job results"
  handler       = "index.handler"
  runtime       = "nodejs12.x"

  # source_path = "src/save-textract-output/dist" // @TODO automate the fact that you have to run build step

  tags = {
    Owner = "pft-extractor"
  }

  publish = true

  allowed_triggers = {
    SNS = {
      service    = "sns"
      source_arn = module.sns_textract_job_completed.this_sns_topic_arn
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket_textract_output.this_s3_bucket_id
  }

  attach_policy_statements = true
  policy_statements = {
    getTextract = {
      effect    = "Allow",
      actions   = ["textract:GetDocumentAnalysis"],
      resources = ["*"]
    },
    s3PutObject = {
      effect    = "Allow",
      actions   = ["s3:PutObject"],
      resources = ["${module.s3_bucket_textract_output.this_s3_bucket_arn}/*"]
    }
  }

  source_path = [
    {
      path = "${path.module}/src/save-textract-output"
      commands = [
        "npm run build",
        "cd dist",
        ":zip"
      ]
    }
  ]
}

module "lambda_function_ingress" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "ingress"
  description   = "Ingress function to call Textract on new PFTs being uploaded"
  handler       = "index.handler"
  runtime       = "nodejs12.x"

  source_path = [
    {
      path = "${path.module}/src/ingress"
      commands = [
        "npm run build",
        "cd dist",
        ":zip"
      ]
    }
  ]

  tags = {
    Owner = "pft-extractor"
  }

  attach_policy_statements = true
  policy_statements = {
    startTextract = {
      effect    = "Allow",
      actions   = ["textract:StartDocumentAnalysis"],
      resources = ["*"]
    },
    s3GetObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket_ingress.this_s3_bucket_arn}/*"]
    }
  }

  environment_variables = {
    "SNS_TOPIC_ARN" = module.sns_textract_job_completed.this_sns_topic_arn
    "ROLE_ARN" = module.textract_service_role.this_iam_role_arn
  }
}

module "s3_notify_lambda_function_ingress" {
  source = "terraform-aws-modules/s3-bucket/aws//modules/notification"
  version = "1.17.0"

  bucket = module.s3_bucket_ingress.this_s3_bucket_id

  lambda_notifications = {
    lambda = {
      function_arn  = module.lambda_function_ingress.this_lambda_function_arn
      function_name = module.lambda_function_ingress.this_lambda_function_name
      events        = ["s3:ObjectCreated:*"]
    }
  }
}

module "sns_textract_job_completed" {
  source  = "terraform-aws-modules/sns/aws"
  version = "2.1.0"

  name = "AmazonTextract-pft-extractor-job-completed"
  display_name = "pft-extractor-job-completed"

  tags = {
    Owner = "pft-extractor"
  }
}

module "textract_service_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  version = "~> 3.0"

  create_role = true

  role_name = "textract-service-role"
  role_requires_mfa = false

  trusted_role_services = [
    "textract.amazonaws.com"
  ]

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonTextractServiceRole"
  ]
  number_of_custom_role_policy_arns = 1

  tags = {
    Owner = "pft-extractor"
  }
}

module "lambda_function_transform" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "transform"
  description   = "Function to transform Textract results into a normalized structure"
  handler       = "index.handler"
  runtime       = "nodejs12.x"

  tags = {
    Owner = "pft-extractor"
  }

  publish = true

  attach_policy_statements = true
  policy_statements = {
    s3GetObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket_textract_output.this_s3_bucket_arn}/*"]
    },
    s3PutObject = {
      effect    = "Allow",
      actions   = ["s3:PutObject"],
      resources = ["${module.s3_bucket_egress.this_s3_bucket_arn}/*"]
    } 
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket_egress.this_s3_bucket_id
  }

  source_path = [
    {
      path = "${path.module}/src/transform"
      commands = [
        "npm run build",
        "cd dist",
        ":zip"
      ]
    }
  ]
}

module "s3_notify_lambda_function_transform" {
  source = "terraform-aws-modules/s3-bucket/aws//modules/notification"
  version = "1.17.0"

  bucket = module.s3_bucket_textract_output.this_s3_bucket_id

  lambda_notifications = {
    lambda = {
      function_arn  = module.lambda_function_transform.this_lambda_function_arn
      function_name = module.lambda_function_transform.this_lambda_function_name
      events        = ["s3:ObjectCreated:Put"]
    }
  }
}

module "lambda_function_list_ingress" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "list-ingress"
  description   = "Function to list ingress results"
  handler       = "index.listIngress"
  runtime       = "nodejs12.x"

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
      resources = ["${module.s3_bucket_ingress.this_s3_bucket_arn}"]
    }
  }

  environment_variables = {
    "S3_BUCKET_INGRESS" = module.s3_bucket_ingress.this_s3_bucket_id
  }

  source_path = "${path.module}/src/api/dist"
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

  function_name = "list-egress"
  description   = "Function to list egress results"
  handler       = "index.listEgress"
  runtime       = "nodejs12.x"

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
      resources = ["${module.s3_bucket_egress.this_s3_bucket_arn}"]
    }
  }

  environment_variables = {
    "S3_BUCKET_EGRESS" = module.s3_bucket_egress.this_s3_bucket_id
  }

  source_path = "${path.module}/src/api/dist"
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

  function_name = "prepare-ingress"
  description   = "Function to create a signed url for documents to be added to ingress"
  handler       = "index.prepareIngress"
  runtime       = "nodejs12.x"

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
      resources = ["${module.s3_bucket_ingress.this_s3_bucket_arn}/*"]
    }
  }

  environment_variables = {
    "S3_BUCKET_INGRESS" = module.s3_bucket_ingress.this_s3_bucket_id
  }

  source_path = "${path.module}/src/api/dist"
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

  function_name = "egress-result"
  description   = "Function to return the end result of the transformation process"
  handler       = "index.egressResult"
  runtime       = "nodejs12.x"

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
      resources = ["${module.s3_bucket_egress.this_s3_bucket_arn}/*"]
    },
    s3GetIngressObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket_ingress.this_s3_bucket_arn}/*"]
    }
  }

  environment_variables = {
    "S3_BUCKET_EGRESS" = module.s3_bucket_egress.this_s3_bucket_id
    "S3_BUCKET_INGRESS" = module.s3_bucket_ingress.this_s3_bucket_id
  }

  source_path = "${path.module}/src/api/dist"
}

module "lambda_function_authorizer" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "authorizer"
  description   = "Function to authorize requests to client api gateway"
  handler       = "index.handler"
  runtime       = "nodejs12.x"

  tags = {
    Owner = "pft-extractor"
  }

  publish = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.client_api.this_apigatewayv2_api_execution_arn}/*/*/*"
    }
  }

  source_path = [
    {
      path = "${path.module}/src/authorizer"
      commands = [
        "npm run build",
        "cd dist",
        ":zip"
      ]
    }
  ]
}

module "client_api" {
  source = "../../../misc/terraform-aws-apigateway-v2"

  name          = "client-api"
  description   = "A gateway for the X client"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.client_api_log_group.arn
  default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  create_api_domain_name = false

  # Access logs
  # default_stage_access_log_destination_arn = "arn:aws:logs:eu-west-1:835367859851:log-group:debug-apigateway"
  # default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

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
    } 
  }

  tags = {
    Owner = "pft-extractor"
  }
}

# @NOTE  Not supported by AWS Terraform module yet
## Therefore, must be manually attached in console... not great, to revisit
resource "aws_apigatewayv2_authorizer" "client_api_authorizer" {
  api_id           = module.client_api.this_apigatewayv2_api_id
  authorizer_type  = "REQUEST"
  authorizer_uri   = module.lambda_function_authorizer.this_lambda_function_invoke_arn
  identity_sources = ["$request.header.Authorization"]
  name             = "client-api-authorizer"
  enable_simple_responses = true
  authorizer_payload_format_version = "2.0"
}

resource "aws_cloudwatch_log_group" "client_api_log_group" {
  name = "client_api"
}