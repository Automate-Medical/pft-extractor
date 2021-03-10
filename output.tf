output "api_uri" {
  value = module.client_api.this_apigatewayv2_api_api_endpoint
}

output "authorizer_id" {
  value = aws_apigatewayv2_authorizer.client_api_authorizer.id
}