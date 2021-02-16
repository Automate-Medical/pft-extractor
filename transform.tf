module "lambda_function_transform" {
  source = "terraform-aws-modules/lambda/aws"
  version = "1.37.0"

  function_name = "transform"
  description   = "Function to transform Textract results into a normalized structure"
  handler       = "index.handler"
  runtime       = "nodejs14.x"

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

  // @TODO log
  // @TODO SSE
  // @TODO public access?
  // @TODO versioning?
}