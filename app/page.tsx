import { LogStream } from '@/components/logs/LogStream'
import { getLogs } from '@/lib/log-actions'

export default async function Home() {
  const logs = await getLogs()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Validation Logs
        </h1>

        <p className="text-text-secondary mt-1">
          Real-time stream of DynamoDB operation validations
        </p>
      </div>

      <LogStream />
    </div>
  )
}
