resource "aws_dynamodb_table" "extracts" {
  name           = "Extracts"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "UUID"


  attribute {
    name = "UUID"
    type = "S"
  }
}