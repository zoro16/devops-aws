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
