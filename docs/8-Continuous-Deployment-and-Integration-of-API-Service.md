h# Continuous Deployment and Integration of API Service


## If you want to use Circle CI 2.0, watch the videos in this order:
  * 1 Overview
  * CircleCI 2 #1 - Setting up CircleCI 2.0
  * 3 IAM User for CircleCI
  * CircleCI 2 #2 - Creating the CircleCI Config File Part 1
  * CircleCI 2 #3 - Creating the CircleCI Config File Part 2
  * CircleCI 2 #4 - Creating the CircleCI Config File Part 3
  * 5 Task Definition Template and Update Script
  * 6 Creating the Build Shell Script and Deploying (but only until we finish making
    the build script)
  * CircleCI 2 #5 - Full Deploy with Circle CI 2

## Overview
  1. Push Code
  2. Watch Changes, Fetch, Test and Build
  3. Push New Image to ECR
  4. Update Service with New Task Definition with new Image
  5. Fetch image
  6. Deploy new Tasks
  
## Things We can do in CircleCI
  1. Tell CircleCI to watch a repository
  2. Specify thing and/or Env Variables
  3. Put a circle.yml file in our code
  
## In order for CircleCI to be able to build and push or docker images to ECR we need to set the permissions for that:
  1. From `IAM -> Policies` we create a new policy `CircleCIBuildRole` with the following JSON:
  ```
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:*",
                "ecs:*"
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
  
  2. From `IAM -> Users` we add a new user:
     * `User Name`: `e.g. CircleCIBuild`
     * `Access type`: `Programmatic access`
     * Click next, then choose `Attach existing policies directly `, then choose the policy we've create in `#1`
     * Create User
     * make sure to save the *.csv file
     
  3. Now from CircleCI page go to `BUILDS -> Setting our Repo -> Environment Variables` and add the following Env Variables:
     * `AWS_ACCOUNT_ID`: we can get it from `support center page`
     * `AWS_DEFAULT_REGION`: `ap-southeast-1` or whichever you want
     * `AWS_ACCESS_KEY_ID`: our Access Key ID for the new user we've created `CircleCIBuild`
     * `AWS_SECRET_ACCESS_KEY`: the Secret access key for the same user
     * `PRODUCTION_RDS_DB`:	`xxxxtydb`
     * `PRODUCTION_RDS_HOST`:	`xxxx.com`
     * `PRODUCTION_RDS_PWD`: `xxxxtpwd`
     * `PRODUCTION_RDS_USER`: `xxxxroot`
     * `AWSLOGS_GROUP`:	`xxxxLogs`
     * `AWSLOGS_REGION`: `xxxxst-1`
     * `AWSLOGS_STREAM_PREFIX`:	`xxxxTask`
     *Note that most of the above variables can be follow in the Task Definition JSON*
## Write the CircleCI YML file
  * `mkdir .circleci && cd .circleci`
  * `touch config.yml`
  * see the file [here](https://github.com/zoro16/devops-aws/blob/master/.circleci/config.yml)
  * Some notes about the config.yml commands
    * `jobs`: (units of work for CircleCI to do) install dependancies or running a deploy script. Note that each job runs in a different session, so if we input some files in one job they won't be available in other jobs.
    * `workflows`: This is how we organize jobs.
    
    * [More Details about jobs and steps](https://circleci.com/docs/2.0/jobs-steps/)
    

## Task Definition Template and Update Script 
    1. Create a base JSON file for Task Definitions with the defaults.
       [Base JSON Task Definition](https://github.com/zoro16/devops-aws/blob/master/task-definition.json)
    2. Create a new JSON file from the base JSON file with our environment variables (defined in CircleCI Environment Variables)
       [Updated Task script](https://github.com/zoro16/devops-aws/blob/master/create-updated-task.js)

## Creating the Build Shell Script and Deploying
    * A shell build script
      * build our docker image and push it to ECR
      * create our new task definition
      * call up to AWS through CLI and update our task definition and service.
      [Deployment script](https://github.com/zoro16/devops-aws/blob/master/deploy.sh)
