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

import { Column, DataFormat, IDatabase, Schema, Table } from '@aws-cdk/aws-glue';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';
export interface KeyPhraseTableProps {
    readonly s3InputDataBucket: Bucket,
    readonly s3BucketPrefix: string,
    readonly database: IDatabase,
    readonly tableName: string
}

export class KeyPhraseTable extends Construct {
    private _table: Table;

    constructor (scope: Construct, id: string, props: KeyPhraseTableProps) {
        super(scope, id);

        this._table = new Table(this, 'KeyPhrase', {
            database: props.database,
            tableName: props.tableName,
            columns: this.entityColumns,
            dataFormat: DataFormat.PARQUET,
            bucket: props.s3InputDataBucket,
            storedAsSubDirectories: true,
            s3Prefix: props.s3BucketPrefix,
            partitionKeys: [{
                name: 'created_at',
                type: Schema.TIMESTAMP
            }]
        });
    }

    private get entityColumns(): Column[] {
        return [{
                name: 'account_name',
                type: Schema.STRING
            }, {
                name: 'platform',
                type: Schema.STRING
            }, {
                name: 'search_query',
                type: Schema.STRING
            }, {
                name: 'id_str',
                type: Schema.STRING
            }, {
                name: 'text',
                type: Schema.STRING
            }, {
                name: 'translated_text',
                type: Schema.STRING
            }, {
                name: 'phrase',
                type: Schema.STRING
            }, {
                name: 'phrase_score',
                type: Schema.DOUBLE
            }, {
                name: 'phrase_begin_offset',
                type: Schema.INTEGER
            }, {
                name: 'phrase_end_offset',
                type: Schema.INTEGER
            }];
    }

    public get table(): Table {
        return this._table;
    }
}