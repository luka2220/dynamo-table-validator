import { getLogs } from '@/lib/log-actions'
import { LOG_ENTRIES_PATH } from '@/lib/store'
import { promises as fs } from 'fs'

/** API route for streaming logs in real-time from the server via Server-Sent Events (SSE) */
export async function GET(request: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let lastModified = 0

      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      /** Polls for file changes every 2 seconds and only sends if the file was modified */
      const interval = setInterval(async () => {
        try {
          const stats = await fs.stat(LOG_ENTRIES_PATH)
          const currentModified = stats.mtimeMs

          // Only send if file was modified
          if (currentModified !== lastModified) {
            lastModified = currentModified
            const logs = await getLogs()
            send(JSON.stringify(logs))
          }
        } catch (error) {
          console.error('Error polling logs:', error)
          send(JSON.stringify({ error: 'Failed to fetch logs' }))
        }
      }, 2000)

      try {
        const logs = await getLogs()
        send(JSON.stringify(logs))
      } catch (error) {
        console.error('Error sending initial logs:', error)
        send(JSON.stringify({ error: 'Failed to fetch logs' }))
      }

      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
