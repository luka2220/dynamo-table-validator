'use server'

import type { LogEntry } from './types'
import {
  LOG_ENTRIES_PATH,
  readJsonFile,
  writeJsonFile,
  serializeLogEntry,
  deserializeLogEntry,
  type SerializedLogEntry,
} from './store'

/**
 * Get all log entries from persistent storage
 */
export async function getLogs(): Promise<LogEntry[]> {
  const serializedLogs =
    await readJsonFile<SerializedLogEntry>(LOG_ENTRIES_PATH)

  return serializedLogs.map(deserializeLogEntry)
}

/**
 * Add a new log entry to persistent storage
 */
export async function addLogEntry(
  entry: LogEntry
): Promise<{ success: boolean; message: string }> {
  try {
    const serializedLogs =
      await readJsonFile<SerializedLogEntry>(LOG_ENTRIES_PATH)

    const serializedEntry = serializeLogEntry(entry)
    serializedLogs.unshift(serializedEntry) // Add to beginning for newest-first order

    await writeJsonFile(LOG_ENTRIES_PATH, serializedLogs)
    return { success: true, message: 'Log entry added successfully' }
  } catch (error) {
    console.error('Error adding log entry:', error)
    return { success: false, message: 'Failed to add log entry' }
  }
}

/**
 * Clear all log entries from persistent storage
 */
export async function clearLogs(): Promise<{
  success: boolean
  message: string
}> {
  try {
    await writeJsonFile(LOG_ENTRIES_PATH, [])

    return { success: true, message: 'Logs cleared successfully' }
  } catch (error) {
    console.error('Error clearing logs:', error)
    return { success: false, message: 'Failed to clear logs' }
  }
}
