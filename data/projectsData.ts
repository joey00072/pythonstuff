interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  stars?: number
}

const projectsData: Project[] = [
  {
    title: 'QuasiQ',
    description: `A simple quantum computer simulator. Implements quantum gates, superposition, and entanglement.`,
    imgSrc: 'https://raw.githubusercontent.com/joey00072/QuasiQ/master/assets/qtee.png',
    href: 'https://github.com/joey00072/QuasiQ',
    stars: 5,
  },
  {
    title: 'TinyTorch',
    description: `A minimal autograd engine built from scratch in under 1000 lines. Capable of training complex models like GPT.`,
    imgSrc: '/static/images/cgraph-05.png',
    href: 'https://github.com/joey00072/Tinytorch',
    stars: 97,
  },
  {
    title: 'microjax',
    description: `A minimal implementation of JAX-style function transformation engine. Builds automatic differentiation, JVP, and VJP from first principles.`,
    imgSrc: 'https://raw.githubusercontent.com/joey00072/microjax/master/grad_plot.png',
    href: 'https://github.com/joey00072/microjax',
    stars: 33,
  },
  {
    title: 'Baji - Programming Language',
    description: `The first Marathi programming language. A high-level, dynamically typed, interpreted language with syntax and documentation entirely in Marathi.`,
    imgSrc: '/static/images/baji.png',
    href: 'https://github.com/joey00072/Baji-Marathi-Programing-Language',
    stars: 67,
  },
  {
    title: 'Iza',
    description: `A minimal container runtime built from scratch, similar to Docker. Implements core container functionality using chroot and syscalls for process isolation.`,
    imgSrc: '/static/images/iza.png',
    href: 'https://github.com/joey00072/iza',
    stars: 15,
  },
  {
    title: 'nanoGRPO',
    description: `A lightweight implementation of Group Relative Policy Optimization (GRPO), a reinforcement learning algorithm.`,
    imgSrc: 'https://raw.githubusercontent.com/joey00072/nanoGRPO/master/assets/ss.png',
    href: 'https://github.com/joey00072/nanoGRPO',
    stars: 125,
  },
  {
    title: 'Multi-Head Latent Attention (MLA)',
    description: `Working implementation of DeepSeek's Multi-Head Latent Attention mechanism.`,
    imgSrc: 'https://raw.githubusercontent.com/joey00072/Multi-Head-Latent-Attention-MLA-/master/assets/MLA.png',
    href: 'https://github.com/joey00072/Multi-Head-Latent-Attention-MLA-',
    stars: 45,
  },
  {
    title: 'Ohara',
    description: `A collection of autoregressive model implementations. Includes diverse models and experiments designed for easy replication and modification.`,
    imgSrc: '/static/images/moe.png',
    href: 'https://github.com/joey00072/ohara',
    stars: 86,
  },
  {
    title: 'Attention as Graph',
    description: `An alternative approach to calculating self-attention using graph-based methods.`,
    imgSrc: 'https://opengraph.githubassets.com/1/joey00072/Attention-as-graph',
    href: 'https://github.com/joey00072/Attention-as-graph',
    stars: 18,
  },
  {
    title: 'fuchsia',
    description: `A minimal library for Reinforcement Learning on Large Language Models. Provides clean abstractions for RLHF and related techniques.`,
    imgSrc: 'https://opengraph.githubassets.com/1/joey00072/fuchsia',
    href: 'https://github.com/joey00072/fuchsia',
    stars: 10,
  },
  {
    title: 'Reinforced Steering Vectors',
    description: `Using Reinforcement Learning to discover steering vectors for controlled text generation.`,
    imgSrc: 'https://opengraph.githubassets.com/1/joey00072/Renforced-Steering-Vectors',
    href: 'https://github.com/joey00072/Renforced-Steering-Vectors',
    stars: 1,
  },
  {
    title: 'numfly',
    description: `A numerical computing library focused on efficient mathematical operations.`,
    imgSrc: 'https://opengraph.githubassets.com/1/joey00072/numfly',
    href: 'https://github.com/joey00072/numfly',
    stars: 0,
  },
]

export default projectsData
