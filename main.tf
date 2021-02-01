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
      events        = ["s3:ObjectCreated:Put"]
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