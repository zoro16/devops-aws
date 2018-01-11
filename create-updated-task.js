'use strict'

const fs = require('fs');

// GRAB OUR BASE TASK
const task = require('./task-definition.json');
const updatedTask = task;
const tag = 'awsdevops/api';


// URL TO OUR IMAGE REPOSITORY
const url = `${process.env.AWS_ACCOUNT_ID}.dkr.ecr.${process.env.AWS_DEFAULT_REGION}.amazonaws.com`;

// TAG OF UPDATED IMAGE
const image = `${url}/${tag}:${process.env.CIRCLE_SHA1}`;

// SET OUR UPDATED IMAGE
updatedTask.containerDefinitions[0].image = image;

// SET OUR ENVIRONMENT RDS VARIABLES
updatedTask.containerDefinitions[0].environment = [
    {
        'name': 'PRODUCTION_RDS_HOST',
        'value': process.env.PRODUCTION_RDS_HOST,
    },
    {
        'name': 'PRODUCTION_RDS_DB',
        'value': process.env.PRODUCTION_RDS_DB,
    },
    {
        'name': 'PRODUCTION_RDS_USER',
        'value': process.env.PRODUCTION_RDS_USER,
    },
    {
        'name': 'PRODUCTION_RDS_PWD',
        'value': process.env.PRODUCTION_RDS_PWD,
    },
    {
        'name': 'NODE_ENV',
        'value': 'production',
    },
]

// SET LOGS
updatedTask.containerDefinitions[0].logConfiguration.options = {
    'awslogs-group': process.env.AWSLOGS_GROUP,
    'awslogs-region': process.env.AWSLOGS_REGION,
    'awslogs-stream-prefix': process.env.AWSLOGS_STREAM_PREFIX
};

 
// CONVERT BACK TO JSON
const jsonTask = JSON.stringify(updatedTask);

// CREATE TEMPORARY FILE
fs.writeFile('updated-task.json', jsonTask, 'utf8');
