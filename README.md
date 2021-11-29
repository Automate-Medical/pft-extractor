# PFT Extractor

A project for managing pulmonary function test data using AWS.

PFT X uses Textract and regular expressions to filter pulmonary function test data out of PDF format and into structured JSON.

**Note** This project is for demonstration purposes only.

# Architecture

![V3](https://user-images.githubusercontent.com/704789/113027190-0b1baa00-9147-11eb-999f-68a93379f7a4.png)

## Tech

- AWS
  - DynamoDB
  - Lambda
  - Textract
  - S3
  - KMS
  - SNS
  - CDK
  - CloudWatch
  - CloudFormation
- TypeScript
- SST + AWS CDK
- React
- Next.js

## Opinions

- ⚙️ Reproducible cloud infrastructure
- 🕵️‍♂️ Audit friendly

# Environment setup

## src/server

0. Set up ~/.aws/credentials. This guide will assume you are using your crendetials as the "default" profile.
1. Ensure you have Node.js 14.x installed
2. `cd src/server; npm install`
3. `npm run deploy`
4. Create a user account to log into via the AWS Managment panel -> Cognito
5. The deployment will store output values necessary to run the client in `outputs.cdk.json` - this file will not be committed

## src/client

The frontend application for the project can be run completely locally.

0. Ensure you have Node.js 12.x installed
1. `cd src/client; npm install`
2. Use the `outputs.cdk.json` values to build a file at `src/client/.env.local` that looks like:

```
NEXT_PUBLIC_API_ENDPOINT = ""
NEXT_PUBLIC_AWS_REGION = ""
NEXT_PUBLIC_USER_POOL_ID = ""
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID = ""
```

3. `npm run start`

# Development

## src/server

We use AWS CloudFormation Stacks to describe the entirety of an individual deployment of the software. We use Serverless Stack (SST) - which is a superset framework on top of AWS CDK - to achieve this. One of the great features about SST is the ability to proxy Lambdas locally. When you're reading to begin work on the contents of `src/server/src`, which is where the APIs etc are defined, you can run a local development environment with `npm run start`.

## src/development

No additional development notes. Make sure you set up your `.env.local` file.
