import type { Link } from '../data/links'

type LinkCardProps = { link: Link }

export default function LinkCard({ link }: LinkCardProps) {
  return (
    <a
      href={link.url}
      className="flex items-center justify-center gap-3 w-full max-w-sm px-6 py-4 rounded-2xl linkcard bg-surface text-text hover:border-amber hover:text-amber transition-colors"
    >
      {link.label}
    </a>
  )
}