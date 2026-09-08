import { useState } from 'react'
import type { Link } from '../data/links'
import CardIcon from './CardIcon'

type LinkCardProps = { link: Link }

export default function LinkCard({ link }: LinkCardProps) {
  const isExternal = link.url.startsWith('http')
  const isMail = link.url.startsWith('mailto:')
  const [copied, setCopied] = useState(false)

  const commonClass =
    'link-card font-mono flex items-center justify-center gap-3 w-full max-w-sm px-6 py-4 rounded-2xl text-text hover:text-amber'

  const handleCopy = async () => {
    const email = link.url.replace('mailto:', '')
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (isMail) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`${commonClass} cursor-pointer`}
      >
        <span className="text-amber">
          <CardIcon name={link.icon} />
        </span>
        <span aria-live="polite">{copied ? '¡Correo copiado!' : link.label}</span>
      </button>
    )
  }

  return (
    <a
      href={link.url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={commonClass}
    >
      <span className="text-amber">
        <CardIcon name={link.icon} />
      </span>
      {link.label}
    </a>
  )
}