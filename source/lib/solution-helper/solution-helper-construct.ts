/*********************************************************************************************************************
 *  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/

import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { ExecutionRole } from './lambda-role-cloudwatch-construct';


export interface SolutionHelperProps {
    readonly solutionId: string;
    readonly searchQuery: string;
    readonly langFilter: string;
}

export class SolutionHelper extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: SolutionHelperProps) {
        super(scope, id);

        const metricsMapping = new cdk.CfnMapping(this, 'AnonymousData', {
            mapping: {
                'SendAnonymousData': {
                    'Data': 'Yes'
                }
            }
        });

        const metricsCondition = new cdk.CfnCondition(this, 'AnonymousDatatoAWS', {
            expression: cdk.Fn.conditionEquals(metricsMapping.findInMap('SendAnonymousData', 'Data'), 'Yes')
        });

        const helperRole = new ExecutionRole(this, 'Role');

        const helperFunction = new lambda.Function(this, 'SolutionHelper', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda_function.handler',
            description: 'This function generates UUID for each deployment and sends anonymous data to the AWS Solutions team',
            role: helperRole.Role,
            code: lambda.Code.fromAsset(`${__dirname}/../../lambda/solution_helper`),
            timeout: cdk.Duration.seconds(30),
            environment: {
                SEARCH_QUERY: props.searchQuery,
                LANG_FILTER: props.langFilter
            }
        });

        const createIdFunction = new cdk.CustomResource(this, 'CreateUniqueID', {
            serviceToken: helperFunction.functionArn,
            properties: {
                'Resource': 'UUID'
            },
            resourceType: 'Custom::CreateUUID'
        });

        const sendDataFunction = new cdk.CustomResource(this, 'SendAnonymousData', {
            serviceToken: helperFunction.functionArn,
            properties: {
                'Resource': 'AnonymousMetric',
                'SolutionId': props.solutionId,
                'UUID': createIdFunction.getAttString('UUID'),
                'Region': cdk.Aws.REGION
            },
            resourceType: 'Custom::AnonymousData'
        });

        (helperFunction.node.defaultChild as lambda.CfnFunction).cfnOptions.condition = metricsCondition;
        (createIdFunction.node.defaultChild as lambda.CfnFunction).cfnOptions.condition = metricsCondition;
        (sendDataFunction.node.defaultChild as lambda.CfnFunction).cfnOptions.condition = metricsCondition;
    }
}
