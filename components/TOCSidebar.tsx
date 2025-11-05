'use client'

import { useEffect, useState } from 'react'
import Link from './Link'

interface TOCItem {
  value: string
  url: string
  depth: number
}

interface TOCSidebarProps {
  toc: TOCItem[]
}

export default function TOCSidebar({ toc }: TOCSidebarProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!toc || toc.length === 0) return

    const observerOptions = {
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    }

    // eslint-disable-next-line no-undef
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    // eslint-disable-next-line no-undef
    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe introduction section (content before first heading)
    const introElement = document.getElementById('introduction')
    if (introElement) {
      observer.observe(introElement)
    }

    // Observe all headings
    toc.forEach((item) => {
      const element = document.getElementById(item.url.slice(1))
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [toc])

  if (!toc || toc.length === 0) {
    return null
  }

  // Add Introduction entry at the beginning if there's content before first heading
  // Set depth to match the first heading's depth (usually 2 for h2)
  const firstHeadingDepth = toc.length > 0 ? toc[0].depth : 2
  const tocWithIntro = [
    {
      value: 'Introduction',
      url: '#introduction',
      depth: firstHeadingDepth,
    },
    ...toc,
  ]

  return (
    <nav className="hidden xl:block absolute left-0 top-0 w-[280px]" style={{ left: 'calc(-280px - 2rem)' }}>
      <div className="sticky top-24 pt-[260px] pl-8 max-h-[calc(100vh-6rem)]">
        <ul className="list-none p-0 m-0 space-y-3">
          {tocWithIntro.map((item) => {
            const isActive = activeId === item.url.slice(1)
            const indentClass =
              item.depth === 2
                ? 'pl-3'
                : item.depth === 3
                  ? 'pl-6'
                  : item.depth === 4
                    ? 'pl-9'
                    : 'pl-0'

            return (
              <li key={item.url} className={indentClass}>
                <Link
                  href={item.url}
                  className={`block text-sm leading-relaxed transition-colors duration-200 no-underline ${
                    isActive
                      ? 'text-gray-900 dark:text-gray-100 font-medium'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {item.value}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

