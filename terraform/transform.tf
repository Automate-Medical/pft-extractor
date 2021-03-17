module "lambda_function_transform" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "transform"
  description   = "Function to transform Textract results into a normalized structure"
  handler       = "index.handler"
  runtime       = "nodejs14.x"

  tags = {
    Product = var.deployment_name
  }

  publish = true

  attach_policy_statements = true
  policy_statements = {
    s3GetObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/save-textract-output/*"]
    },
    s3PutObject = {
      effect    = "Allow",
      actions   = ["s3:PutObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/egress/*"]
    },
    kmsDecrypt = {
      effect    = "Allow",
      actions   = ["kms:Decrypt"],
      resources = [aws_kms_key.objects.arn]
    },
    kmsEncrypt = {
      effect    = "Allow",
      actions   = ["kms:GenerateDataKey"]
      resources = [aws_kms_key.objects.arn]
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  source_path = "${path.module}/../src/transform/dist"
}

module "lambda_function_interpret" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "interpret"
  description   = "Function to provide an automated interpretation of a normalized PFT"
  handler       = "index.handler"
  runtime       = "nodejs14.x"

  tags = {
    Product = var.deployment_name
  }

  publish = true

  attach_policy_statements = true
  policy_statements = {
    s3GetObject = {
      effect    = "Allow",
      actions   = ["s3:GetObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/egress/*"]
    },
    s3PutObject = {
      effect    = "Allow",
      actions   = ["s3:PutObject"],
      resources = ["${module.s3_bucket.this_s3_bucket_arn}/interpretation/*"]
    },
    kmsDecrypt = {
      effect    = "Allow",
      actions   = ["kms:Decrypt"],
      resources = [aws_kms_key.objects.arn]
    },
    kmsEncrypt = {
      effect    = "Allow",
      actions   = ["kms:GenerateDataKey"]
      resources = [aws_kms_key.objects.arn]
    }
  }

  environment_variables = {
    "S3_BUCKET" = module.s3_bucket.this_s3_bucket_id
  }

  source_path = "${path.module}/../src/interpret/dist"
}