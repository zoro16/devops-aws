# Building the Full Infrastructure with CloudFormation
  [AWS Resource Types Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html)

## Overview
#### The Advantages of CloudFormation
  * Version Control since its a code.
  * 5000 Ft View of the entire Infastructure
  * Easily Automated
  * Change values in one place and have them spill through the entire Infastructure
  * Delete the full stack in one click or command
  * Build/Rebuild full stack in one click or command
  * Disaster Recovery!

#### CloudFormation Basics
  * `mkdir web/cfn && touch web/cfn/template.json`
  * In  `template.json` Create the top level paramerters for or CloudFormation json file:
    1. `AWSTemplateFormatVersion`
    2. `Description`
    3. `Metadata`
    4. `Parameters`
    5. `Mappings`
    6. `Conditions`

#### More Top Level Parameters with Cluster and Usage
###### `Resources` is where most of our code will be
  * CloudFormation Update Types:
    1. Update without interruption to the service
    2. Update with interruption to the service
    3. Replace the service entirely

  * We will use the AWS Resource Types to create a `ECS Cluster`, but we are not going to give it a name, because by doing so we are taking away from CloudFormation the ability to entirely replace the resource.
  * The parameter name should start with Upper case letter.

#### CloudFormation Security Groups
   * To create a Security Groups
     1. Add an object parameter `e.g. WebInstanceSecurityGroup` under `Resources`
     2. with `Type`=> `AWS::EC2::SecurityGroup`
     3. with `Properties`:
        1. `GroupDescription`=> `any shit`
        2. `VpcId`=> We should create `VpcId` under the top level parameter `Parameters` with `Type`=>`AWS::EC2::VPC::Id` and any `Description`, then refer to it `Ref` here
        3. Add `Tags` object the `Key`=>`Name` and `Value`=>`the name we want`
        4. Then add an array of Inbound Rules `SecurityGroupIngress` specifying `IpProtocol`, `FromPort`, `ToPort`, `CidrIp`, object `SourceSecurityGroupId` 


#### CloudFormation IAM Roles
  * [Good stuff about AWS IAM Policies](https://start.jcolemorrison.com/aws-iam-policies-in-a-nutshell/)
  * To create an IAM Role:
    1. Add an object parameter `e.g.WebInstanceRole` under `Resources`
    2. with `Type`=> `AWS::IAM::Role`
    3. with `Properties`:
       1. `AssumeRolePolicyDocument` object with `Statement` array
          * to specify the service that this role is allowed to access
          ```
          "AssumeRolePolicyDocument": {
            "Statement": [
              {
                "Effect": "Allow",
                "Principal": {
                "Service": [ "ec2.amazonaws.com" ]
               },
                "Action": [ "sts:AssumeRole" ]
              }
            ]
          }
          ```
       2. `Policies` is this an inline policy
        ```
        "Policies": [
          {
            "PolicyName": "WebEcsLogs",
            "PolicyDocument": {
              "Statement": {
                "Effect": "Allow",
                "Action": [
                  "logs:CreateLogGroup",
                  "logs:DescribeLogStreams"
                ],
                "Resource": [
                  "arn:aws:logs:*:*:*"
                ]
              }
            }
          }
        ],
       ```
       3. `ManagedPolicyArns`
          * As for now, we have to go to `IAM -> Policies -> then look for the arn that we want`
          ```
          "ManagedPolicyArns": [
            "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
            "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
          ]
          ```

#### CloudFormation Elastic Application Load Balancer
###### To create a load balancer
* First step, create the Application Load Balancer
  1. `Type`=> `AWS::ElasticLoadBalancingV2::LoadBalancer`
  2. `Properties`:
     1.  `Name`=> `vpcity-web-alb`
     2.  `Scheme`=> `internet-facing`
     3.  `LoadBalancerAttributes`:
         - `Key`=> `idle_timeout.timeout_seconds`
         - `Value` => `60`
     4.  `SecurityGroups`: `Ref`=> `WebALBSecurityGroup`, we have create it this security group above.
     5.  `Subnets`: `Ref`=> `SubnetIDs`, we should create the `SubnetIDs` parameter before we can refer to it here, see
       ```
       "SubnetIDs":{
          "Type":"List<AWS::EC2::Subnet::Id>",
          "Description":"Select at least two subnets in your selected VPC."
       }
       ```

* Second step, create the Target Group
  ```
  "WebALBTargetGroup": {
      "Type":"AWS::ElasticLoadBalancingV2::TargetGroup",
      "DependsOn": "WebALB",
      "Properties": {
        "HealthCheckPath":"/health-alb",
        "HealthCheckProtocol":"HTTP",
        "HealthCheckIntervalSeconds":10,
        "HealthCheckTimeoutSeconds":5,
        "HealthyThresholdCount":2,
        "UnhealthyThresholdCount":2,
        "Port":80,
        "Protocol":"HTTP",
        "VpcId":{
          "Ref":"VpcId"
        }
      }
    },
  ```
* Third step, create the Listener
  ```
  "WebALBListener": {
      "Type":"AWS::ElasticLoadBalancingV2::Listener",
      "Properties":{
        "LoadBalancerArn":{
          "Ref":"WebALB"
        },
        "Port":"80",
        "Protocol":"HTTP",
        "DefaultActions":[
          {
            "Type":"forward",
            "TargetGroupArn":{
              "Ref":"WebALBTargetGroup"
            }
          }
        ]
      }
  }
  ```

* Finally, Rule for Listener
  ```
  "WebALBListenerRule": {
      "Type":"AWS::ElasticLoadBalancingV2::ListenerRule",
      "DependsOn": "WebALBListener",
      "Properties": {
        "ListenerArn": {
          "Ref": "WebALBListener"
        },
        "Actions": [
          {
            "Type":"forward",
            "TargetGroupArn":{
              "Ref":"WebALBTargetGroup"
            }
          }
        ],
        "Conditions": [
          {
            "Field": "path-pattern",
            "Values": [
              "/"
            ]
          }
        ],
        "Priority": 1
      }
  }
  ```

#### CloudFormation Launch Configuration
  * some important refs
    - [AWS-Specific Parameter Types](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#aws-specific-parameter-types)
    - [Intrinsic Function Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html)
    - [Pseudo Parameters Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html)
  
  * Take a look at the ugly file

#### CloudFormation Autoscaling Group
  * some references
    * [CreationPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html)
    * [UpdatePolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html)

  * The steps are:
    1. `AWS::IAM::InstanceProfile`
    2. `AWS::AutoScaling::LaunchConfiguration`
    3. `AWS::AutoScaling::AutoScalingGroup`


### CloudFormation ECS Task Definition
  * 
