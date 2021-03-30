resource "aws_kms_key" "objects" {
  description             = "KMS key is used to encrypt ${var.deployment_name}-bucket objects"
  # @TODO - required? what about rotation?
  # deletion_window_in_days = 7
}

module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${var.deployment_name}-bucket"
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = true
  }

  tags = {
    Product = var.deployment_name
  }

  // @TODO log
  // @TODO public access? <- write only?

  cors_rule = [
    {
      allowed_methods = ["PUT", "POST", "GET"]
      allowed_origins = ["*"] // @TODO
      allowed_headers = ["*"]
      expose_headers  = []
      max_age_seconds = 3000
    }
  ]

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        kms_master_key_id = aws_kms_key.objects.arn
        sse_algorithm     = "aws:kms"
      }
    }
  }
}

module "lambda_function_ingress" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "ingress"
  description   = "Ingress function to call Textract on new PFTs being uploaded"
  handler       = "index.handler"
  runtime       = "nodejs14.x"

  tags = {
    Product = var.deployment_name
  }

  source_path = "${path.module}/../src/ingress/dist"

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
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/ingress/*"]
    },
    kmsDecrypt = {
      effect    = "Allow",
      actions   = ["kms:Decrypt"],
      resources = [aws_kms_key.objects.arn]
    },
    updateExtracts = {
      effect    = "Allow",
      actions   = ["dynamodb:UpdateItem"],
      resources = [aws_dynamodb_table.extracts.arn]
    }
  }

  environment_variables = {
    "SNS_TOPIC_ARN" = module.sns_textract_job_completed.this_sns_topic_arn
    "ROLE_ARN" = module.textract_service_role.this_iam_role_arn
  }
}

module "s3_notify_lambda_functions" {
  source = "terraform-aws-modules/s3-bucket/aws//modules/notification"
  version = "1.17.0"

  bucket = module.s3_bucket.this_s3_bucket_id

  lambda_notifications = {
    ingress = {
      function_arn  = module.lambda_function_ingress.this_lambda_function_arn
      function_name = module.lambda_function_ingress.this_lambda_function_name
      events        = ["s3:ObjectCreated:*"]
      filter_prefix = "ingress/"
    }

    saveTextractOutput = {
      function_arn  = module.lambda_function_structure.this_lambda_function_arn
      function_name = module.lambda_function_structure.this_lambda_function_name
      events        = ["s3:ObjectCreated:Put"]
      filter_prefix = "save-textract-output/"
    }

    egress = {
      function_arn  = module.lambda_function_interpret.this_lambda_function_arn
      function_name = module.lambda_function_interpret.this_lambda_function_name
      events        = ["s3:ObjectCreated:Put"]
      filter_prefix = "egress/"
    }
  }
}

module "lambda_function_scan" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "scan"
  description   = "Function to save and store Textract Job results"
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  timeout       = 10

  tags = {
    Product = var.deployment_name
  }

  publish = true

  allowed_triggers = {
    SNS = {
      service    = "sns"
      source_arn = module.sns_textract_job_completed.this_sns_topic_arn
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
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
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/save-textract-output/*"]
    },
    kmsEncrypt = {
      effect    = "Allow",
      actions   = ["kms:GenerateDataKey"]
      resources = [aws_kms_key.objects.arn]
    },
    updateExtracts = {
      effect    = "Allow",
      actions   = ["dynamodb:UpdateItem"],
      resources = [aws_dynamodb_table.extracts.arn]
    }
  }

  source_path = "${path.module}/../src/scan/dist"
}

module "sns_textract_job_completed" {
  source  = "terraform-aws-modules/sns/aws"
  version = "2.1.0"

  name = "AmazonTextract-pft-extractor-job-completed"
  display_name = "pft-extractor-job-completed"

  tags = {
    Product = var.deployment_name
  }
}

resource "aws_sns_topic_subscription" "sns_textract_job_completed_subscription" {
  topic_arn = module.sns_textract_job_completed.this_sns_topic_arn
  protocol  = "lambda"
  endpoint  = module.lambda_function_scan.this_lambda_function_arn
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
    Product = var.deployment_name
  }
}