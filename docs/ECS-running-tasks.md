# ECS Services

## Docs
    https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html
    https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-task-definition.html#task-definition-template
    https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html
    https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html
    https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html

## What a service does?
    1) setup Tasks from Task Definition on the best suited Container Instances (same as running the task)
    2) Monitors our Tasks and Repot metrics
        https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html
        https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#available_cloudwatch_metrics
        https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#service_utilization
    3) Keeps the number of Tasks we specify always up and running
    4) Updates our Tasks by handling them on Updated Task Definition.
        https://docs.aws.amazon.com/ApplicationAutoScaling/latest/APIReference/Welcome.html
    5) Optionally scales out/up our tasks based on customer demond (traffic)
    6) Distributes our customer demond evenly to all Tasks via Load Balancer (if we hook one up)


## Application Load Balancer with ECS
### Classic vs Application LBs
  - Classic Load Balancer spread Traffic Between Instences
  - Application Load Balancer Spread Traffic Between TASKS

### Application Load Balancer primery components
  - The Load Balancer
  - Target Groups
  - Listeners
  - Listener Rules

### Example Setup For Edges Company
  - Edges Task Definition
  - Edges Serive using The Task Definition
  - Target Group called Edges Target
  - Hand the traget group, Edges target, to our Service (The traget group needs to be empty)
  - Service registers ALL of Edges Tasks in Service with the Target Group
  - Set up a Listener for 'HTTP' requests on 'PORT 80'
  - Create a Listener Rule for Path "/" = send traffic to Edges Target Group

### Load Balancer for CubeBuster and the above serive
    ```
        Listener for HTTP 80 Traffic

        Listener Rule 1 - Send to CubeBuster Targets:

        Target Group: CubeBuster Targets
        Path: `/cubebuster`
        Priority: `1`

        Listener Rule 2 - Send to Edges Targets:

        Target Group: Edges Targets
        Path: `/`
        Priority: `2`
    ```

### Launch Configurations and Auto Scaling Groupss with ECS
  - Container Instances are just EC2 instances that have the ECS Container Agent on them.
  - How to make Container Instances
    * Use the ECS-Optimized AMI
    * OR Install/Configure the ECS Container Agent + Docker
  - Getting AutoScaling Groups Up
     * selecting the desired launch configuration
     * selecting which VPC and Subnets to lunch instances into
     * determining how many instances you'd like
     * configure scaling actions based on CloudWatch alarms (optional)
     * setting up notifications for events
  - Launch Configs + AutoScaling Groups + ECS
    * Setting up a Launch Config with ECS Container Agent
    * Pointing the Container Agent to the Desired Cluster

  - Note About Container Instances
    * Point directly ton the internet gateway
    * Point to a NAT Gateway or NAT Instances

