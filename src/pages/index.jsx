import Head from 'next/head'

import { Container } from '@/components/Container'
import {
  TwitterIcon,
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/social/SocialIcons'
import { generateRssFeed } from '@/lib/generateRssFeed'
import { getAllArticles } from '@/lib/getAllArticles'
import {Slider} from '../components/Slider'
import SocialLink from '@/social/SocialLink';
import Article from '@/components/article/Article';
import Newsletter from '@/components/Newsletter';
import Resume from '@/components/Resume';

// SLIDER DATA
const images = [
  { url: '/shon_BW.png' },
  { url: '/riding.png' },
  { url: '/sun_studio_close.png' },
  { url: '/tux_pattern.png' },
  { url: '/outside_sun_studios.png' },
]

export default function Home({ articles }) {
  return (
    <>
      <Head>
        <title>
          Shaun Hartman - Software engineer, musician, digital creator
        </title>
        <meta
          name="description"
          content="I’m Shaun, a software engineer at Big Human most of the time. When I'm not creating for clients, I'm creating for the world & enjoying my family."
        />
      <meta name="og:title" content="Shaun Hartman | Creator" />
      <meta name="og:image" content="/shaun-portrait.jpg" />

      </Head>
      {/* ABOVE THE FOLD */}
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Shaun Hartman - Creator
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I’m Shaun, a software engineer at Big Human and a life long creator.<br></br>
            I like to rock. Whether on a stage, developing software, acting, or teaching Yoga. Count me in for 100%. 
            Technology has allowed me to expand indefinitely. So, maybe I can truly say 110% & beyond.
            I try to teach whenever called upon & learn whenever fortunate.
          </p>
          {/* SOCIAL LINKS */}
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://www.instagram.com/shaunpaulhartman"
              aria-label="Follow on Instagram"
              icon={InstagramIcon}
            />
            <SocialLink
              href="https://github.com/shonhartman"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://www.linkedin.com/in/shaun-hartman-1909a42b"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      {/* SLIDER */}
      <Slider images={images} />
      {/* BELOW THE FOLD */}
      <Container>
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === 'production') {
    await generateRssFeed()
  }

  return {
    props: {
      articles: (await getAllArticles())
        .slice(0, 4)
        .map(({ component, ...meta }) => meta),
    },
  }
}
