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
    3. If alarm if triggered, tell our ECS service
    4. When our service is notified of the alarm, tell it to add more Tasks to our Service.
  * Automating Anything in AWS
    1. Pick a Metric to Watch
    2. Set a threshold
    3. If alarm triggers, perform an action
  * Service Memory Reservation and Utilization
    * Total Service Memory Reservation = Number of Tasks * Memory Reserved By Each Task
    * Service Memory Utilization = Memory Utilized by Total Tasks / Memory Reserved by Total Tasks
  * Cluster CPU Utilization = CPU Utilized by All Service Tasks / CPU Totals from All Container Instances
  * Push-Pull of Autoscaling
    * As Services Add Tasks, Add Container Instances to Match
    * As Services Remove Tasks, Remove Container Instances to Match

* Autoscaling ECS Services
  * 
