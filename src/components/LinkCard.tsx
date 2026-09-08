import type { Link } from '../data/links'


type LinkCardProps = { link: Link }

export default function LinkCard({ link }: LinkCardProps) {
  const isExternal = link.url.startsWith('http')

  return (
    <a
      href={link.url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="link-card font-mono flex items-center justify-center gap-3 w-full max-w-sm px-6 py-4 rounded-2xl text-text hover:text-amber"
    >
      {link.label}
    </a>
  )
}