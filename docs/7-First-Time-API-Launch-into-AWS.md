# First Time API Launch Into AWS


## Push our images to ECR
  * `$(aws ecr get-login --no-include-email --region ap-southeast-1)`
  * `docker build -t awsdevops/api .`
  * `docker tag awsdevops/api:latest 153153493606.dkr.ecr.ap-southeast-1.amazonaws.com/awsdevops/api:latest`
  * `docker push 153153493606.dkr.ecr.ap-southeast-1.amazonaws.com/awsdevops/api:latest`

## Setting Up the API Task Definition
  * Go to `Elastic Container Service -> Task Definitions -> Create a Task Definition`
  * Add Task Definition Name *awsdevops-api-task-def*
  * If we want our Task Definition to interact with other aws services (e.g. S3) we need to specify `Task Role` but we are not going to do it now.
  * `Network Mode` => `Brige`
  * Add container
    * `Container name` => `awsdevops-api-task`
    * `Image` => `<get Repository URI for the image that we want to use>:latest`
    * `Memory Limits (MiB)` => `Soft limit 496MB` *more or less*
    * `Port mappings` => 
      * `Host port` => `0` *this tells ECS to be dynamiclly mapped*
      * `Container port` => `3000` *any port we want*
    * **ENVIRONMENT**
      * `CPU units` => `500` *will make our metrics easier to scale if we know how much our tasks is looking to reserve*
      * `Env Variables` => *these variables will be avalible inside our container*
        ```
            {
                'PRODUCTION_RDS_HOST: '<Endpoint for th RDB>',
                'PRODUCTION_RDS_DB': '<DB Name>',
                'PRODUCTION_RDS_PWD': '<DB PWD>',
                'PRODUCTION_RDS_USER': '<Username>'
            }
        ```
  * **STORAGE AND LOGGING**
    * We need to setup this to pool logs for our container, but need to create a new logs first:
      * Go to `CloudWatch -> Logs -> Actions -> Create log group -> add a name`
      * Back to Add Container page:
        * `Log Configuration -> Select awslog`
        * `awslogs-group         | AwsdevopsApiLogs`
        * `awslogs-region        | ap-southeast-1`
        * `awslogs-stream-prefix | AwsdevopsApiLogsTask`
        * `Create`
    
  * Launching Our Service
    * We need to make sure that the `Auto Scaling Groups` that we have created previously is up and running.
    * From `ECS -> Cluster -> we choose our cluser -> then we create a Service`
      * **Configure service**
        * `Task Definition` => is the Task Definition we have created `awsdevops-api-task-def`
        * `Cluster` => same
        * `Service name` => we give it a name (e.g. VpcityApiService)
        * `Number of tasks` => `2` *the number of the tasks is the same with the number of our instances*
        * `Placement Templates` => `AZ Balanced Spread`
     **Configure network**
        * `Load balancer type` => Application Load Balance
        * `Service IAM role` => 
          * `Service IAM role` => `VpcityEcsServiceRole`
          * `Load balancer name` => `vpcity-alb`
        * **Container to load balance**
          * Add load balancer
          * `Listener port` => 80:HTTP
          * `Target group name` => we have create previously (e.g. vpcity-api-targets)
       * Will configure AutoScaling later on
