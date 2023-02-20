import Head from 'next/head'
import { useRecoilState } from 'recoil';
import clsx from 'clsx'

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
import { sliderActiveState } from '../state/slider-active';
import SocialLink from '@/social/SocialLink';
import Article from '@/components/article/Article';
import Newsletter from '@/components/Newsletter';
import Resume from '@/components/Resume';

// SLIDER DATA
const images = [
  // Front
  { position: [0, 0, 2.95], rotation: [0, 0, 0], url: '/rocking.png' },
  // Left
  { position: [-1.35, 0, 2.8], rotation: [0, 0, -0.01], url: '/cooking.png' },
  { position: [-2.45, 0, 3], rotation: [0, 0, -0.02], url: '/onewheel.png' },
  // Right
  { position: [1.4, 0, 2.75], rotation: [0, -0, -0.01], url: '/coding.png' },
  { position: [2.5, 0, 3], rotation: [0, -0, 0.01], url: '/yoga_class.png' }
]


export default function Home({ articles }) {
  // SLIDER STATE
  const [active, setSliderState] = useRecoilState(sliderActiveState);

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
      <meta name="og:title" content="Shaun Hartman | Digital Creator" />
      <meta name="og:image" content="/images/photos/shaun-portrait.jpg" />

      </Head>
      {/* ABOVE THE FOLD */}
      <Container className={clsx('mt-9', {'relative': active})}>
        <div className={clsx('max-w-2xl', {'absolute': active})}>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Shaun Hartman - Digital Creator
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I’m Shaun, a software engineer at Big Human and a life long creator.<br></br>
            I like to rock. Whether on a stage, developing software, or teaching Yoga. Count me in for 100%. 
            Everything is enhanced by the digital. So, maybe I can truly say 110% & beyond.
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
      {/* 3D SLIDER */}
      <div className={clsx('', {'relative': active, 'z-10': active, 'h-[2000px]': active})}>
        <Slider images={images} />
      </div>
      {/* BELOW THE FOLD */}
      <Container className={clsx('', {'relative -mt-32 -top-[1160px] z-0': active})}>
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
