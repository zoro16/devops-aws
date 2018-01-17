#!/usr/bin/env bash

set -e
DATE_TAG=`date +%s%3S`
NEW_IMAGE=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazon.com/$IMAGE_REPO:$DATE_TAG


echo "Building image..."
docker build -t $NEW_IMAGE .

echo "Pushing image"
docker push $NEW_IMAGE

aws cloudformation update-stack --stack-name $CFN_STACK_NAME --use-previous-template --capabilities CAPABILITY_IAM \
  --parameters ParameterKey=WebTaskImage,ParameterValue=$NEW_IMAGE \
  ParameterKey=BastionSecurityGroup,UsePreviousValue=true \
  ParameterKey=DesiredCapacity,UsePreviousValue=true \
  ParameterKey=InstanceType,UsePreviousValue=true \
  ParameterKey=KeyPairName,UsePreviousValue=true \
  ParameterKey=MinSize,UsePreviousValue=true \
  ParameterKey=MaxSize,UsePreviousValue=true \
  ParameterKey=SubnetIDs,UsePreviousValue=true \
  ParameterKey=VpcId,UsePreviousValue=true \
  ParameterKey=DesiredTaskCount,UsePreviousValue=true \
  ParameterKey=MinTaskCount,UsePreviousValue=true \
  ParameterKey=MaxTaskCount,UsePreviousValue=true \
  ParameterKey=Autoscale,UsePreviousValue=true
