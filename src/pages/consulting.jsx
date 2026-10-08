import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Button } from '@/components/Button'

function ProofPoints({ children, ...props }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function ProofPoint({ title, event, children }) {
  return (
    <Card as="li">
      <Card.Title as="h3">{title}</Card.Title>
      <Card.Eyebrow decorate>{event}</Card.Eyebrow>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export default function Consulting() {
  return (
    <>
      <Head>
        <title>AI Systems Consulting - Shaun Hartman</title>
        <meta
          name="description"
          content="Practical AI consulting and automation for real operational problems — not AI strategy fluff."
        />
        <meta name="og:title" content="Shaun Hartman | AI Systems Consulting" />
        <meta name="og:image" content="/shaun-portrait.jpg" />
      </Head>
      <SimpleLayout
        title="AI Systems Consulting: practical automation for real operational problems."
        intro="I've become incredibly adept at helping businesses put AI to work on the tedious, specific problems that slow them down. If your team is drowning in repetitive questions, QA, or scheduling, that's exactly what I can help with."
      >
        <div className="space-y-20">
          <Section title="What I can do for you">
            <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                First of all, you&apos;re probably spending too much on premium AI
                models and extra products, when what you really need is the
                context that makes an AI agent stay on track. Most teams
                don&apos;t need more tools. They need a little guidance to get
                more out of what they already have. You probably need a system that anyone
                can use and share across an organization, so that your agents
                and most importantly, your people are all on the same page.
              </p>
              <p>
                A lot of people are also nervous about configuring these
                systems. With an agent running in a terminal, it&apos;s hard to
                know what&apos;s safe, how much can be automated, and how much
                needs your approval. I set these systems up so your people can
                work autonomously inside a strong harness that keeps things
                safe and secure.
              </p>
              <p>
                From there, I automate the repetitive work that eats your
                team&apos;s time. I can help with anything from solving one
                painful problem to creating a full roadmap for your team.
              </p>
            </div>
          </Section>
          <ProofPoints title="Experience">
            <ProofPoint
              title="Knowledge base and scheduling integration for a small business"
              event="Three New York locations, run remotely"
            >
              Built a knowledge base that answers questions already covered
              in the business&apos;s own documentation, and a scheduling
              integration for the same small business.
            </ProofPoint>
            <ProofPoint
              title="AI automation for software product teams"
              event="Clients and internal systems"
            >
              Day to day, I work with software product teams to reduce costs
              and boost productivity significantly. I&apos;ve brought a ton of
              AI value to clients, and internally by streamlining our systems
              and creating documentation that gives AI agents and humans the
              context they need to do effective work securely and without
              mistakes.
            </ProofPoint>
          </ProofPoints>
          <Section title="How it works">
            <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                It starts with a free intro call to understand the problem.
                If it&apos;s a fit, work is scoped project-by-project around
                what needs solving.
              </p>
            </div>
          </Section>
          <Section title="Get in touch">
            <div className="space-y-6">
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                Tell me how I can make your life easier.
              </p>
              <Button href="mailto:shaunhartman@icloud.com?subject=AI%20Systems%20Consulting%20inquiry">
                Email me
              </Button>
            </div>
          </Section>
        </div>
      </SimpleLayout>
    </>
  )
}
