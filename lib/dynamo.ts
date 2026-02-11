'use server'

import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  GetItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb'
import { getSchemaByTableName } from './schema-actions'
import type { DynamoRequestData } from './types'

const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
})

export async function ValidateDynamoRequest(request: DynamoRequestData) {
  console.log('ValidateDynamoRequest Body', request.body)

  try {
    switch (request.operation) {
      case 'GetItem': {
        return await GetItem(request.body)
      }
      case 'Query': {
        return await Query(request.body)
      }
      case 'PutItem':
      case 'UpdateItem':
      case 'DeleteItem':
      default:
        throw new Error(`Invalid dynamo operation: ${request.operation}`)
    }
  } catch (error) {
    const isError = error instanceof Error
    console.error('An error ocurred in the ValidateFynamoRequest function: ', {
      error: isError ? error.message : error,
      stack: isError && error.stack,
    })

    throw error
  }
}

/** Listens and forwards a GetItem request to DynamoDB */
async function GetItem(body: GetItemCommandInput) {
  const command = new GetItemCommand(body)
  return await dynamoClient.send(command)
}

/** Listens and forwards a Query request to DynamoDB */
async function Query(body: QueryCommandInput) {
  const command = new QueryCommand(body)
  return await dynamoClient.send(command)
}

/** Parses a PutItem command and validates it against a stored table schema */
async function PutItem(body: PutItemCommandInput) {
  const tableName = body.TableName
  const schema = await getSchemaByTableName(tableName || '')

  if (!schema) {
    // If no schema was found for the table, forward the request
    return await dynamoClient.send(new PutItemCommand(body))
  }

  throw new Error('Invalid schema for table: ' + tableName)
}
