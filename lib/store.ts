import { promises as fs } from 'fs'
import path from 'path'
import type { LogEntry } from './types'

// File paths for JSON persistence
export const LOG_ENTRIES_PATH = path.join(
  process.cwd(),
  'store/log-entry-data.json'
)
export const SCHEMAS_PATH = path.join(
  process.cwd(),
  'store/table-schema-data.json'
)

// Serialized version of LogEntry with ISO string timestamp
export type SerializedLogEntry = Omit<LogEntry, 'timestamp'> & {
  timestamp: string
}

/**
 * Read and parse a JSON file
 * Returns empty array if file doesn't exist or is invalid
 */
export async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content) as T[]
  } catch (error) {
    // Return empty array if file doesn't exist or is invalid
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

/**
 * Write data to a JSON file
 */
export async function writeJsonFile<T>(
  filePath: string,
  data: T[]
): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath, content, 'utf-8')
}

/**
 * Serialize a LogEntry for JSON storage
 * Converts Date to ISO string
 */
export function serializeLogEntry(entry: LogEntry): SerializedLogEntry {
  return {
    ...entry,
    timestamp: entry.timestamp.toISOString(),
  }
}

/**
 * Deserialize a LogEntry from JSON storage
 * Converts ISO string back to Date
 */
export function deserializeLogEntry(entry: SerializedLogEntry): LogEntry {
  return {
    ...entry,
    timestamp: new Date(entry.timestamp),
  } as LogEntry
}
