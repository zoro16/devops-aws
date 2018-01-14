# AutoScaling our API Service and Infrastructure

## Overview
  * The ECS Cluster
    * Clusters Manage Container Instances
    * Container Instances => EC2 Instances in ECS
    * Task Definitions => docker image + instance resources to create containers from
    * Services => create long running tasks from Task Definitions
    * Tasks => Instantiation of a Task Definition
    * Running a Task => running a Task once
  * Service CPU Utilization = CPU Utilized by Total Tasks / CPU Reserved by Total Tasks
  * Autoscaling Process
    1. Setup CloudWatch alarm to watch `Service CPU Utilization`
    2. Set alarm to trigger if Service CPU Utilization goes over 70%
    3. If alarm is triggered, tell our ECS service
    4. When our service is notified of the alarm, tell it to add more Tasks to our Service.
  * Automating Anything in AWS
    1. Pick a Metric to Watch
    2. Set a threshold
    3. If alarm is triggered, perform an action
  * Service Memory Reservation and Utilization
    * Total Service Memory Reservation = Number of Tasks * Memory Reserved By Each Task
    * Service Memory Utilization = Memory Utilized by Total Tasks / Memory Reserved by Total Tasks
  * Cluster CPU Utilization = CPU Utilized by All Service Tasks / CPU Totals from All Container Instances
  * Push-Pull of Autoscaling
    * As Services Add Tasks, Add Container Instances to Match
    * As Services Remove Tasks, Remove Container Instances to Match

## AutoScaling ECS Services
  * We will setup the Autoscaling in way that it will scale Up and Down based on the CPU Utilization
    * Go to `ECS ->  Clusters -> Click on the you created Service Name ->`
    * `Update -> Next step -> Next step -> Configure Service Auto Scaling to adjust your service’s desired count`
    * Set our
      * `Minimum`
      * `Desired`
      * `Maximum`
      * `IAM role`
    * We head to CloudWatch now to create an Alarm
      * `Create Alarm`
      * `ECS Metrics -> ClusterName,ServiceName`
      * Select `CPUUtilization for our Cluster/Service`
      * Set:
        * `Name`
        * `Description`
        * `Wherever: CPUUtilization` less or equal than, bigger or equal than, less than, or bigger than
          - `CPUUtilization <= 2` Below
          - `CPUUtilization >= 2` Above
        * `Period`: 1 Minute
        * No need to set any notification for now, but we can do that later.
        * We need to repeat the above step for Below and Above CPU (the number we want)
    * We head back to Service Auto Scaling
      * `Add scaling policy` once for Removing Tasks and another for Adding Tasks
    * After we are down we grab the ELP DNS and and use shell tool called `ab` to stress test our Auto Scaling
      * The command looks like this `ab -n <number-of-requests> -n <how-many-to-send-at-the-same-time> <endpoint>
      * `ulimit -n 10000`
      * example `ab -n 10000 -c 500 http://vpcity-alb-1049916510.ap-southeast-1.elb.amazonaws.com/`

## AutoScaling ECS Container Instances
  * We are going to make 4 Alarms in CloudWatch
    a. CPU Utilization Above the threshold
    b. CPU Reservation Above the threshold
    c. CPU Utilization Below the threshold
    d. CPU Reservation Below the threshold

  --1. CPU Reservation Above the threshold
     1. From CloudWatch `Alarms -> Create Alarm -> ClusterName`
     2. Select `our ClusterName with CPUResevation -> Next`
     3. Give a verbose name and description
     4. set the thershold
     5. click create
     
  * Repeat #1 for b,c, and d `CloudWatch Alarms`
  
  * Now head to `EC2 -> Auto Scaling Groups`
  * Select our Auto Scaling Group `vpcity-api-autoscaling-group`
  * `Scaling Policies -> Add policy -> Create a scaling policy with steps`
    * `Name`
    * `select the Execute policy when`
    * `Take the action` either add or remove instances
    * `And then wait` specify a cooling period
  * Apply the pervious step for all the CloudWatch Alarms that we've created.
  
