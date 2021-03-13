# PFT X

A project for managing pulmonary function test data using AWS.

# Architecture

# Deployment/Creating a new env

0. You will receive access to our AWS platform with our own developer account at https://automatemedical.awsapps.com/start#/ - set up ~/.aws/credentials (your developer account is isolated from the rest of our infra)
1. Install Terraform
2. Create a TF workspace `terraform workspace new {env}`
3. Create a new tfvars file in the root ({env}.tfvars) containing:
```
deployment_name = "your-deployment-name" // name of deployment
aws_region = "ca-central-1" // ca-central-1 is default for us but anywhere is fine
aws_profile = "aws-profile-name" // the credentials profile to use from ~/.aws/credentials
```
4. Run `terraform apply -var-file="{env}.tfvars"`
5. Configure the client environment variables using the terraform config output (`terraform output | sed 's/^/NEXT_PUBLIC_/g' > src/x/.env.local`)
6. Create a user account to log into via the AWS Managment panel -> Cognito
7. Run the client where you'd like - for a development environment, just run it locally

We apply the above strategy for all developer environments. We modify the strategy slightly for staging. We use Terraform Cloud to continuously deploy `master` to `PFTXStagingAccount`. We use AWS Amplify to continuous deploy the client, and have manually configured environment variables.

# Development

# Testing


