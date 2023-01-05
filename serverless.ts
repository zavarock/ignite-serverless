import type {AWS} from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    service: 'ignite-certificate',
    frameworkVersion: '3',
    plugins: [
        'serverless-esbuild',
        'serverless-dynamodb-local',
        'serverless-offline'
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    // import the function via paths
    functions: {
        createUser: {
            handler: 'src/functions/createUser.handler',
            events: [
                {
                    http: {
                        path: 'users',
                        method: 'post',
                        cors: true
                    }
                }
            ]
        },
        getTodos: {
            handler: 'src/functions/getTodos.handler',
            events: [
                {
                    http: {
                        path: 'todos/{userId}',
                        method: 'get',
                        cors: true,
                        request: {
                            parameters: {
                                paths: {
                                    userId: true
                                }
                            }
                        }
                    }
                }
            ]
        },
        createTodo: {
            handler: 'src/functions/createTodo.handler',
            events: [
                {
                    http: {
                        path: 'todos/{userId}',
                        method: 'post',
                        cors: true,
                        request: {
                            parameters: {
                                paths: {
                                    userId: true
                                }
                            }
                        }
                    }
                }
            ]
        },
        changeTodo: {
            handler: 'src/functions/changeTodo.handler',
            events: [
                {
                    http: {
                        path: 'todos/{id}',
                        method: 'put',
                        cors: true,
                        request: {
                            parameters: {
                                paths: {
                                    id: true
                                }
                            }
                        }
                    }
                }
            ]
        },
        doneTodo: {
            handler: 'src/functions/doneTodo.handler',
            events: [
                {
                    http: {
                        path: 'todos/{id}/done',
                        method: 'patch',
                        cors: true,
                        request: {
                            parameters: {
                                paths: {
                                    id: true
                                }
                            }
                        }
                    },
                }
            ]
        },
        deleteTodo: {
            handler: 'src/functions/deleteTodo.handler',
            events: [
                {
                    http: {
                        path: 'todos/{id}',
                        method: 'delete',
                        cors: true,
                        request: {
                            parameters: {
                                paths: {
                                    id: true
                                }
                            }
                        }
                    }
                }
            ]
        }
    },
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
        dynamodb: {
            stages: ['dev', 'local'],
            start: {
                port: 8000,
                inMemory: true,
                seed: true,
                migrate: true
            }
        }
    },
    resources: {
        Resources: {
            UsersTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "users",
                    AttributeDefinitions: [
                        {
                            AttributeName: "id",
                            AttributeType: "S"
                        },
                        {
                            AttributeName: "username",
                            AttributeType: "S"
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "id",
                            KeyType: "HASH"
                        }
                    ],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: "usernameIndex",
                            KeySchema: [
                                {
                                    AttributeName: "username",
                                    KeyType: "HASH"
                                }
                            ],
                            Projection: {
                                ProjectionType: "ALL"
                            },
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            },
            TodosTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "todos",
                    AttributeDefinitions: [
                        {
                            AttributeName: "id",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "user_id",
                            AttributeType: "S",
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "id",
                            KeyType: "HASH"
                        }
                    ],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: "userIdIndex",
                            KeySchema: [
                                {
                                    AttributeName: "user_id",
                                    KeyType: "HASH"
                                }
                            ],
                            Projection: {
                                ProjectionType: "ALL"
                            },
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            }
        }
    }
};

module.exports = serverlessConfiguration;
