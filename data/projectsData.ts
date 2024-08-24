interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Baji - Programing Language',
    description: `First Marathi programming language, which is high-level, dynamically typed, and interpreted, facilitating programming with syntax and documentation in the Marathi language`,
    imgSrc: '/static/images/baji.png',
    href: 'https://github.com/joey00072/Baji-Marathi-Programing-Language',
  },
  {
    title: 'TinyTorch',
    description: `Torch is autograd engine for build just under 1000 lines, Its tiny but capable of building complex models like GPT.​`,
    imgSrc: '/static/images/cgraph-05.png',
    href: 'https://github.com/joey00072/TinyTorch',
  },
  {
    title: 'Ohara',
    description: `Ohara, is a comprehensive collection focused on the implementation of autoregressive models, including diverse models and experiments designed for easy replication and modification, and for research and development purposes.`,
    imgSrc: '/static/images/moe.png',
    href: 'https://github.com/joey00072/Ohara',
  },
  {
    title: 'Iza',
    description: `Iza container runtime similar to Docker, focusing on the essentials of container functionality like chroot and syscalls for process isolation​.`,
    imgSrc: '/static/images/iza.png',
    href: 'https://github.com/joey00072/iza',
  },
]

export default projectsData
