'use server'

import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb'
import type { DynamoRequestData } from './types'

const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
})

export async function ValidateDynamoRequest(request: DynamoRequestData) {
  try {
    console.info('Request -> ', request)
    console.info('Request Body -> ', request.body)

    switch (request.operation) {
      case 'GetItem': {
        const getResponse = await GetItem(request.body)
        return new Response(JSON.stringify(getResponse))
      }
      case 'QueryItem': {
        const response = await Query(request.body)
        return new Response(JSON.stringify(response))
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

    return new Response('Something went wrong', {
      status: 500,
    })
  }
}

async function GetItem(body: GetItemCommandInput) {
  const command = new GetItemCommand(body)
  const response = await dynamoClient.send(command)
  return response
}

async function Query(body: QueryCommandInput) {
  const command = new QueryCommand(body)
  const response = await dynamoClient.send(command)
  return response
}
