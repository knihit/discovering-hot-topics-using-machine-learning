#!/usr/bin/env node
/**********************************************************************************************************************
 *  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                     *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/


import * as cdk from '@aws-cdk/core';
import { DiscoveringHotTopicsStack } from '../lib/discovering-hot-topics-stack';

const app = new cdk.App();
new DiscoveringHotTopicsStack(app, 'discovering-hot-topics-using-machine-learning', {
    description: '(SO0122) - Discovering Hot Topics using Machine Learning. Version %%VERSION%%',
    solutionID: 'SO0122',
    solutionName: 'discovering-hot-topics-using-machine-learning'
});