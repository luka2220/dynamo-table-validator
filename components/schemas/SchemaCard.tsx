import { TableSchema } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SchemaCardProps {
  schema: TableSchema;
  isSelected: boolean;
  onClick: () => void;
}

export function SchemaCard({ schema, isSelected, onClick }: SchemaCardProps) {
  return (
    <Card
      padding="md"
      hover={!isSelected}
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-accent border-accent' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text-primary">{schema.tableName}</h3>
        <Badge variant="neutral">{schema.attributes.length} attrs</Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">Partition Key:</span>
          <code className="px-1.5 py-0.5 rounded bg-bg-tertiary text-accent font-mono text-xs">
            {schema.partitionKey.name} ({schema.partitionKey.type})
          </code>
        </div>

        {schema.sortKey && (
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Sort Key:</span>
            <code className="px-1.5 py-0.5 rounded bg-bg-tertiary text-accent font-mono text-xs">
              {schema.sortKey.name} ({schema.sortKey.type})
            </code>
          </div>
        )}
      </div>
    </Card>
  );
}
