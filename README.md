# PFT X

A project for managing pulmonary function test data using AWS.

# Architecture

![V3](https://user-images.githubusercontent.com/704789/113027190-0b1baa00-9147-11eb-999f-68a93379f7a4.png)


## Opinions

- ⚙️ Reproducible cloud infrastructure
- 🕵️‍♂️ Audit friendly

## Unsolved questions

- Should we just use CloudFormation and ditch Terraform?
- Is there a better way to manage Lambda versions and builds? Prsently, the assumption is that builds will be committed to the /dist folder in each directory project.

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
5. Configure the client environment variables using the terraform config output (`terraform output | sed 's/^/NEXT_PUBLIC_/g' > ../src/x/.env.local`)
6. Create a user account to log into via the AWS Managment panel -> Cognito
7. Run the client where you'd like - for a development environment, just run it locally

We apply the above strategy for all developer environments. We modify the strategy slightly for staging. We use Terraform Cloud to continuously deploy `master` to `PFTXStagingAccount`. We use AWS Amplify to continuous deploy the client, and have manually configured environment variables.

# Development

Right now, the development environment isn't exactly local. Because our product basically packages up AWS primitives, our development environements are also on AWS. However, becase we Terraform they are *very* reproducible.

When you join the project, an entire AWS account namespace will be assigned to you. You create your development environment using the 0-8 Deployment steps above.

Work on the client happens locally, since it just consumes AWS resources.

Lastly, a pre-commit hook to build the lambda functions when they change can be helpful:

```
#!/bin/sh

git stash --keep-index --include-untracked
paths=$(git diff-index --cached --name-only HEAD | grep 'src/' | cut -d'/' -f-2 | uniq)
for path in $paths
do
(cd $path && npm run build)
done
git add .
git stash pop
exit 0
```

# Testing
