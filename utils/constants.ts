/** Name of a custom dynamo validation error */
export const DynamoValidationErrorType = 'DynamoValidationError'

/**  DynamoDB type labels for display  */
export const dynamoDBTypeLabels = {
  S: 'String',
  N: 'Number',
  B: 'Binary',
  BOOL: 'Boolean',
  L: 'List',
  M: 'Map',
  SS: 'String Set',
  NS: 'Number Set',
  BS: 'Binary Set',
  NULL: 'Null',
} as const
