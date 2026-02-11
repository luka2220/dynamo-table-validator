import { DynamoValidationErrorType } from '@/utils/constants'

/** Custom error class for dynamo request errors */
export class DynamoRequestError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly receivedSchema: string,
    public readonly expectedSchema: string
  ) {
    super(message)
    this.name = DynamoValidationErrorType
    this.operation = operation
    this.receivedSchema = receivedSchema
    this.expectedSchema = expectedSchema
  }

  /** Logs to stderr the different between the expected schema and the recieved schema */
  logScehmaDifference() {
    console.error(
      'The expected schema and the recieved schema are different: ',
      {
        expectedSchema: this.expectedSchema,
        receivedSchema: this.receivedSchema,
      }
    )
  }
}
