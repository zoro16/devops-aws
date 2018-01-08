# Creating AWS Resources for the API
## Making our App production ready
* Create a Dockerfile for the App
-- api/Dockerfile
-- api/entrypoint.sh
* Setup a "datasource.production.js" file to connect to RDS
-- api/server/datasource.production.js => loopback will assume that it's nodeenv environment variables file

## Setting Up Security Groups and IAM Roles
* security group for our ecs application load balancer
-- HTTP ->  0.0.0.0/0
* security group for api cluster instances
-- SSH -> bastion
-- TCP -> Port range 31000-61000  to api application load balancer
* security group for db RDS instances
-- MySQL/Aurora -> api instances
-- MySQL/Aurora -> bastion
 *Including bastion hosts in your VPC environment enables you to securely connect to your Linux instances without exposing your environment to the Internet*
 *Bastion hosts are also configured with security groups to provide fine-grained ingress control*

* Create a Role: (This Role is going to allow our EC2 Instances to link up with our cluster and receive tasks)
-- Select
```
EC2 Role for Elastic Container Service
  Allows EC2 instances in an ECS cluster to access ECS.
```
-- Next, Next, then Name it.
* After we created the role, click on it then click `Attach Policy`, search for `AmazonEC2RoleforSSM` and click on it.
  *`AmazonEC2RoleforSSM` -> Amazon EC2 Role for Simple Systems Manager service role.*
* Create a custom policy to direct our logs to CloudWatch, the steps are:
  -- Click on `Add inline policy`
  -- Add the following JSON
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:DescribeLogStreams"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*"
      ]
    }
  ]
}
```
-- Add a name to the policy `vpcityEcsInstanceLogs`, then click on `Create Policy`

* Create another Role: (It allows to pair our ECS Serives Tasks with our Application Load Balancer)
-- This time Select
```
Elastic Container Service
  Allows ECS to create and manage AWS resources on your behalf.
```
-- Next, Next, `VpcityEcsServiceRole`

* Create Last Role: (It will allow us to scale the number or container we have running in our cluster base on the traffic that they will be receiving)
-- Select
```
Elastic Container Service Autoscale
  Allows Auto Scaling to access and update ECS services.
```


## Lunch MYSQL RDS Instance

* We need to enable two things from VPC first
  -- From VPC -> Your VPCs -> Select vpcity -> Actions -> Edit DNS Resolution -> make sure its selected to (Yes)
  -- From VPC -> Your VPCs -> Select vpcity -> Actions -> Edit DNS Hostnames  -> make sure its selected to (Yes)
  *In order for RDS to work for our VPC we have to give the DNS server that sets inside each VPC the ability to assign hostnames*

* Before we create our RDS, we should first create `Subnet Groups`
  -- `Create DB Subnet Group`, using our VPC-DB subnets that we've created previously

* Now we can Launch our DB instances
  -- Instances -> Launch DB Instance -> Select MySQL -> Next -> Dev/test
  ```
  DB instance identifier: vpcitydb
  Master username: vpcityroot
  Master password: vpcityroot
  ```
* We can't access this DB Instance unless we try that from our Bastion EC2 Instance that we created previously.
  `mysql -h <DB Instance Endpoint> -u <Master username> -p`


## Elastic Load Balancer

* Types of Load Balancers
-- Classic Load Balancer - spread traffic between servers
-- Application Load Balancer - spread traffic between tasks (Target Groups instead of EC2 Instances)
