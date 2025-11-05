import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import TOCSidebar from '@/components/TOCSidebar'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const tweetUrl = (path, title) => {
  const encodedTitle = encodeURIComponent(`Check out this article: ${title}`)
  let encodedUrl = encodeURIComponent(`${siteMetadata.siteUrl}/${path} \n\n`)

  // Replace %2D with -
  encodedUrl = encodedUrl.replace(/%2D/g, '-')

  return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}\n`
}

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <div className="relative">
        {toc && toc.length > 0 && <TOCSidebar toc={toc} />}
        <article className={toc && toc.length > 0 ? 'xl:ml-12' : ''}>
          <div className="pt-6 pb-8">
          <header className="text-center mb-8">
            <div className="space-y-4">
              <dl className="space-y-2">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-[15px] leading-[21px] text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <h1 className="text-[30px] font-semibold leading-[1.4] max-w-[480px] mx-auto mb-4">
                  {title}
                </h1>
              </div>
              {authorDetails.length > 0 && (
                <div className="flex flex-col items-center space-y-1 text-[15px] leading-[21px] text-gray-600 dark:text-gray-400">
                  {authorDetails.map((author) => (
                    <div key={author.name} className="flex items-center space-x-2">
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={24}
                          height={24}
                          alt="avatar"
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                      <span className="text-gray-700 dark:text-gray-300">{author.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </header>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <div className="pb-8 pt-4">
              <div id="introduction" className="prose max-w-none dark:prose-invert">{children}</div>
              <div className="pb-6 pt-6 text-sm text-gray-600 dark:text-gray-400">
                {`   ( ˶ᵔ ᵕ ᵔ˶ )   `}
                <Link href={tweetUrl(path, title)} target="_blank" rel="noopener noreferrer">
                  Discuss on Twitter
                </Link>
              </div>
              {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-600 dark:text-gray-400"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer className="pt-8">
              {tags && (
                <div className="pb-6">
                  <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              )}
              {(next || prev) && (
                <div className="flex flex-col space-y-6 py-6">
                  {prev && prev.path && (
                    <div>
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                        Previous Article
                      </h2>
                      <div className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        <Link href={`/${prev.path}`}>{prev.title}</Link>
                      </div>
                    </div>
                  )}
                  {next && next.path && (
                    <div>
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                        Next Article
                      </h2>
                      <div className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        <Link href={`/${next.path}`}>{next.title}</Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="pt-4">
                <Link
                  href={`/${basePath}`}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
      </div>
    </SectionContainer>
  )
}
