import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/social/SocialIcons'
import portraitImage from '@/images/shaun-portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-purple-500 dark:text-zinc-200 dark:hover:text-purple-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-purple-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export default function About() {
  return (
    <>
      <Head>
        <title>About - Shaun Hartman</title>
        <meta
          name="description"
          content="I’m Shaun Hartman. I live in Little Rock, where I build the future for Big Human clients."
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Hi 👋 I’m Shaun Hartman.
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                I’ve loved making things for as long as I can remember, as a kid I was always drawing, 
                I was a scatter brained artist until technology gave me a plethora of tools to balance myself.
              </p>
              <p>
                Learning to play the guitar pulled me from a deep despair as a teen. 
                It was the first thing that I gained mastery over. Music has remained a staple in 
                my life. It is the lens that I first used to model my learning. Writing a song is an 
                interesting work. The materials are quite abstract, much like software engineering. 
                Giving structure to abstraction is a skill that I am ever refining. It 
                continues to be very rewarding. My life as a musician hasn&apos;t paid much, but 
                it has given me many skills of which leadership and teamwork have been at the forefront.
                My engineering skills have poured back into the music & branched out to support other ventures
                such as acting. Most recently 3D art is coming into my grasp. I love to learn & I love 
                the creative process.
              </p>
              <p>
                Today, I&apos;m at Big Human, where I have the honor of working with the 
                clients at the forefront of innovation.
              </p>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink href="https://www.instagram.com/shaunpaulhartman" icon={InstagramIcon} className="mt-4">
                Follow on Instagram
              </SocialLink>
              <SocialLink href="https://github.com" icon={GitHubIcon} className="mt-4">
                Follow on GitHub
              </SocialLink>
              <SocialLink href="https://www.linkedin.com/in/shaun-hartman-1909a42b" icon={LinkedInIcon} className="mt-4">
                Follow on LinkedIn
              </SocialLink>
              <SocialLink
                href="mailto:shaunhartman@icloud.com"
                icon={MailIcon}
                className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
              >
                shaunhartman@icloud.com
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </>
  )
}
