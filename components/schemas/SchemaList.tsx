'use client'

import { TableSchema } from '@/lib/types'
import { SchemaCard } from './SchemaCard'
import { Button } from '@/components/ui/Button'

interface SchemaListProps {
  schemas: TableSchema[]
  selectedId: string | null
  onSelect: (schema: TableSchema) => void
  onCreateNew: () => void
}

export function SchemaList({
  schemas,
  selectedId,
  onSelect,
  onCreateNew,
}: SchemaListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Table Schemas
        </h2>

        <Button size="sm" onClick={onCreateNew}>
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Schema
        </Button>
      </div>

      <div className="space-y-2">
        {schemas.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            No schemas defined yet
          </div>
        ) : (
          schemas.map((schema) => (
            <SchemaCard
              key={schema.id}
              schema={schema}
              isSelected={selectedId === schema.id}
              onClick={() => onSelect(schema)}
            />
          ))
        )}
      </div>
    </div>
  )
}
