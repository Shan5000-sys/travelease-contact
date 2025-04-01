output "api_gateway_url" {
  value = "https://${aws_api_gateway_rest_api.contact_api.id}.execute-api.${var.region}.amazonaws.com/prod/contact"
  description = "API Gateway endpoint for contact form"
}