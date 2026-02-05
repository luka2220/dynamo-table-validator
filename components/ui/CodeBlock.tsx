'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({
  code,
  language = 'json',
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={handleCopy}
        className="
          absolute top-2 right-2 px-2 py-1 rounded text-xs
          bg-bg-tertiary text-text-secondary border border-border
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          hover:bg-bg-primary hover:text-text-primary
        "
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre
        className={`
          p-4 rounded-lg overflow-x-auto
          bg-bg-primary border border-border
          text-sm text-text-primary
        `}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
