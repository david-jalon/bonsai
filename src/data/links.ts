export type Link = {
  label: string
  url: string
}

export type Dropdown = {
  label: string
  links: Link[]
}

export const links: Link[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/davidjalon' },
  { label: 'GitHub', url: 'https://github.com/david-jalon' },
  { label: 'Portfolio', url: '/portfolio.html' },
  { label: 'Email', url: 'mailto:davidjalon@protonmail.com' },
]

export const dropdowns: Dropdown[] = [
  {
    label: 'Proyectos destacados',
    links: [
      { label: 'Helpfinder', url: 'https://helpfinder-theta.vercel.app/' },
    ],
  },
  {
    label: 'Antiguos proyectos FX',
    links: [
      { label: 'Vimeo', url: 'https://vimeo.com/878328452' },
      { label: 'IMDb', url: 'https://www.imdb.com/es-es/name/nm11576765/' },
    ],
  },
]