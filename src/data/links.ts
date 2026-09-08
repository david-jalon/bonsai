export type Link = {
  label: string
  url: string
  icon: string
}

export type Dropdown = {
  label: string
  links: Link[]
}

export const links: Link[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/davidjalon', icon: 'linkedin' },
  { label: 'GitHub', url: 'https://github.com/david-jalon', icon: 'github' },
  { label: 'Portfolio', url: '/portfolio.html', icon: 'portfolio' },
  { label: 'Email', url: 'mailto:davidjalon@protonmail.com', icon: 'email' },
]

export const dropdowns: Dropdown[] = [
  {
    label: 'Proyectos destacados',
    links: [
      { label: 'Helpfinder', url: 'https://helpfinder-theta.vercel.app/', icon: 'helpfinder' },
    ],
  },
  {
    label: 'Antiguos proyectos FX',
    links: [
      { label: 'Vimeo', url: 'https://vimeo.com/878328452', icon: 'vimeo' },
      { label: 'IMDb', url: 'https://www.imdb.com/es-es/name/nm11576765/', icon: 'imdb' },
    ],
  },
]