'use client'

import { useEffect, useState } from 'react'
import type { LogEntry } from '@/lib/types'

/** Hook for streaming logs in real-time from the server */
export function useLogsStream() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const eventSource = new EventSource('/api/logs/stream')

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.error) {
          setError(data.error)
          return
        }

        // Update logs
        setLogs(data as LogEntry[])
      } catch (err) {
        console.error('Error parsing SSE data:', err)
        setError('Failed to parse log data')
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setError('Connection error')
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return { logs, isConnected, error }
}
