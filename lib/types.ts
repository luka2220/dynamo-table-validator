// DynamoDB attribute types
export type DynamoDBType = 'S' | 'N' | 'B' | 'BOOL' | 'L' | 'M' | 'SS' | 'NS' | 'BS' | 'NULL';

// Key attribute types (only S, N, B allowed for keys)
export type KeyType = 'S' | 'N' | 'B';

// Operation types
export type OperationType = 'PutItem' | 'UpdateItem' | 'DeleteItem';

// Log status
export type LogStatus = 'success' | 'error';

// Validation error
export interface ValidationError {
  attributeName: string;
  expectedType: string;
  receivedType: string;
  receivedValue: unknown;
  message: string;
}

// Base log entry
interface BaseLogEntry {
  id: string;
  timestamp: Date;
  tableName: string;
  operation: OperationType;
}

// Success log entry
export interface SuccessLogEntry extends BaseLogEntry {
  status: 'success';
  data: Record<string, unknown>;
}

// Error log entry
export interface ErrorLogEntry extends BaseLogEntry {
  status: 'error';
  errors: ValidationError[];
  attemptedData: Record<string, unknown>;
}

// Union type for log entries
export type LogEntry = SuccessLogEntry | ErrorLogEntry;

// Schema attribute
export interface SchemaAttribute {
  name: string;
  type: DynamoDBType;
  required: boolean;
}

// Key definition
export interface KeyDefinition {
  name: string;
  type: KeyType;
}

// Table schema
export interface TableSchema {
  id: string;
  tableName: string;
  partitionKey: KeyDefinition;
  sortKey?: KeyDefinition;
  attributes: SchemaAttribute[];
}

// Type guards
export function isSuccessLogEntry(entry: LogEntry): entry is SuccessLogEntry {
  return entry.status === 'success';
}

export function isErrorLogEntry(entry: LogEntry): entry is ErrorLogEntry {
  return entry.status === 'error';
}
