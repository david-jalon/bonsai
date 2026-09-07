export type Link = {
    label: string;
    url: string;
    category: 'redes' | 'trabajos' | 'contacto';
}

export const links: Link[] = [
    {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/davidjalon',
        category: 'redes'
    },
    {
        label: 'Github',
        url: 'https://github.com/david-jalon',
        category: 'redes'
    },
    {
        label: 'Website',
        url: 'https://pordeterminar.com',
        category: 'redes'
    },
    {
        label: 'Helpfinder',
        url: 'https://helpfinder-theta.vercel.app/',
        category: 'trabajos'
    },
    {
        label: 'Email',
        url: 'mailto:davidjalon@protonmail.com',
        category: 'contacto'
    },
    {
        label: 'CV',
        url: '/CV_David_Jalon.pdf',
        category: 'contacto'
    }
];