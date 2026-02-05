'use server'

import type { TableSchema } from './types'
import { SCHEMAS_PATH, readJsonFile, writeJsonFile } from './store'

/**
 * Get all table schemas from persistent storage
 */
export async function getSchemas(): Promise<TableSchema[]> {
  return readJsonFile<TableSchema>(SCHEMAS_PATH)
}

/**
 * Save a table schema (create or update)
 */
export async function saveSchema(
  schema: TableSchema
): Promise<{ success: boolean; message: string; schema?: TableSchema }> {
  try {
    const schemas = await readJsonFile<TableSchema>(SCHEMAS_PATH)
    const existingIndex = schemas.findIndex((s) => s.id === schema.id)

    if (existingIndex >= 0) {
      schemas[existingIndex] = schema
    } else {
      schemas.push(schema)
    }

    await writeJsonFile(SCHEMAS_PATH, schemas)
    return { success: true, message: 'Schema saved successfully', schema }
  } catch (error) {
    console.error('Error saving schema:', error)
    return { success: false, message: 'Failed to save schema' }
  }
}

/**
 * Delete a table schema by ID
 */
export async function deleteSchema(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const schemas = await readJsonFile<TableSchema>(SCHEMAS_PATH)
    const filteredSchemas = schemas.filter((s) => s.id !== id)

    if (filteredSchemas.length === schemas.length) {
      return { success: false, message: 'Schema not found' }
    }

    await writeJsonFile(SCHEMAS_PATH, filteredSchemas)
    return { success: true, message: 'Schema deleted successfully' }
  } catch (error) {
    console.error('Error deleting schema:', error)
    return { success: false, message: 'Failed to delete schema' }
  }
}
