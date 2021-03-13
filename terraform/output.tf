output "API_ENDPOINT" {
  value = module.client_api.this_apigatewayv2_api_api_endpoint
}

output "AWS_REGION" {
  value = var.aws_region
}

output "USER_POOL_ID" {
  value = aws_cognito_user_pool.client_user_pool.id
}

output "USER_POOL_WEB_CLIENT_ID" {
  value = aws_cognito_user_pool_client.client_user_pool_client.id
}