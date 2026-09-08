import { useState } from 'react'
import type { Dropdown } from '../data/links'
import CardIcon from './CardIcon'

type DropdownCardProps = { dropdown: Dropdown }

export default function DropdownCard({ dropdown }: DropdownCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full max-w-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="link-card font-mono flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl text-text hover:text-amber"
      >
        <span>{dropdown.label}</span>
        <span>{open ? '▾' : '▸'}</span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="mt-2 flex flex-col gap-2">
            {dropdown.links.map(link => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="link-card font-mono mx-auto w-full max-w-xs flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm text-text hover:text-amber"
              >
                <span className="text-amber">
                  <CardIcon name={link.icon} />
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}