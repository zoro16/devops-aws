# Continuous Deployment with AWS CodePipeline and CodeBuild

## Overview
#### The CI/CD Components - CodePipline
  * **High-level look at Stages**
    ![alt text](https://docs.aws.amazon.com/codepipeline/latest/userguide/images/Hi-Level-PipelineFlow.png)
  * **Pipline Flow**
    ![alt text](https://docs.aws.amazon.com/codepipeline/latest/userguide/images/PipelineFlow.png)
  * We will focus on **Source** => `our github repo` and **Build** => `send to AWS CodeBuild`



#### IAM Roles for CodePipeline and CodeBuild
  * [Using Identity-Based Policies (IAM Policies) for AWS CodePipeline ](https://docs.aws.amazon.com/codepipeline/latest/userguide/iam-identity-based-access-control.html#how-to-custom-role)
  * As for now the is no way to setup IAM Roles for CodePipeline and CodeBuild from the Console, so we had to setup as the following.
    - Run the following command
    ```bash
    aws iam create-role --role-name AwsdevopsCodePipelineServiceRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":{"Effect":"Allow","Principal":{"Service":"codepipeline.amazonaws.com"},"Action":"sts:AssumeRole"}}' --profile YOURPROFILE
    ```
    *Replace YOURPROFILE with your profile name*
  
  - Then we will have to create a new policies for this newly created role will follow the AWS [recommendation](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html) for this one .
  - `IAM -> Policies -> Create policy -> JSON -> add the json from the recommendation link above`
  - Click next, then give it a name `AwsdevopsCodePipelineServicePolicy` and description.
  - Then click `Create Policy`
  - Now we go back to the role `AwsdevopsCodePipelineServiceRole` to Attach `AwsdevopsCodePipelineServicePolicy` policy to it. 
  
  - Now we need create a new policy `AwsdevopsCodeBuildServicePolicy`
  - The Policy for CodeBuild:
   ```json
   {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "ecr:*",
          "ecs:*",
          "cloudformation:DescribeStack*",
          "cloudformation:UpdateStack",
          "ec2:Describe*",
          "iam:GetRole"
        ],
        "Resource": "*"
      },
      {
        "Effect": "Deny",
        "Action": [
          "ecr:Delete*",
          "ecr:BatchDeleteImage",
          "ecs:Delete*"
        ],
        "Resource": "*"
      }
    ]
  }
  ```
  - Create our new Role, `Roles -> Create role -> CodeBuild -> Next:Permission`
    ```    
    CodeBuild
    Allows CodeBuild to call AWS services on your behalf.
    ```
  - Then we look for the codeBuild Policy we have created `AwsdevopsCodeBuildServicePolicy`
  - Name it `AwsdevopsCodeBuildServiceRole`



#### Building the AWS CodeBuild Docker Image
  * [AWS CodeBuild curated Docker images](https://github.com/aws/aws-codebuild-docker-images/tree/master/ubuntu)
  * From the above link we are going to compain the Dockerfiles code for Docker, Node (with the updated versions of the softwares) and will at YARN installation into the file too.
  * Then we will build our image `docker build -t awsdevops/codebuild dockerfils/test/`, then we tag it and push to ECR
  * We need to give CodeBuild the permission to pull this image from ECR
    - 
