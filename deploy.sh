#!/usr/bin/env sh

set -e

CLUSTER="vpcity-api-cluster"
IMAGE_TAG="awsdevops/api"
SERVICE="VpcityApiService"
TASK_DEFINITION="awsdevops-api-task-def"

IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_TAG:$CIRCLE_SHA1"

function push_to_registry() {
    echo "pushing to registry"

    # BUILD DOWN NEW VESION OF IMAGE
    docker build --rm=false -t $IMAGE .

    # LOGIN TO ECR AS CircleCI
    eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

    # PUSH IMAGE TO ECR
    docker push $IMAGE    
}

function update_api_service() {
    echo "updating api service"

    # CREATE UPDATE TASK
    node ./create-updated-task.js

    # REGISTER THE NEW TASK DEFINITION WITH ECS
    aws ecs register-task-definition --cli-input-json file://updated-task.json

    # UPDATE THE SERVICE, IN OUR CLUSTER, WITH THE NEW TASK DEFINITION
    aws ecs update-service --cluster $CLUSTER \
                           --service $SERVICE \
                           --task-definition $TASK_DEFINITION

    # REMOVE TEMP FILE
    rm -rf ./updated-task.json
}

function update_ecs() {
    push_to_registry
    update_api_service
}

update_ecs
