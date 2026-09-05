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
        intro="I help businesses put AI to work on the tedious, specific problems that actually slow them down — not abstract strategy decks. If your team is drowning in repetitive questions, QA, or scheduling, that's exactly what this is for."
      >
        <div className="space-y-20">
          <Section title="What I do">
            <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                &quot;AI Systems&quot; covers two related things: building the context and
                knowledge architecture a business needs so AI tools actually
                know what they&apos;re talking about, and automating the repetitive
                work that eats a team&apos;s time once that context exists. Most
                engagements start with one concrete, painful problem, not a
                full roadmap.
              </p>
            </div>
          </Section>
          <ProofPoints title="Proof points">
            <ProofPoint
              title="Knowledge base for a multi-location small business"
              event="Gemini Gem, launched 2026-09-04"
            >
              Built a Gemini Gem knowledge base for a small business (three NY
              locations, run remotely from Little Rock) so it can answer
              customer questions already covered in its own documentation.
              Answering well after two iterations. Next target for this
              business: automating scheduling.
            </ProofPoint>
            <ProofPoint
              title="QA automation for software product teams"
              event="Day job"
            >
              Day to day, I work with software product teams to reduce QA
              costs significantly through AI-driven automation, alongside
              colleagues doing similar work.
            </ProofPoint>
          </ProofPoints>
          <Section title="How it works">
            <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                It starts with a free intro call to understand the problem.
                If it&apos;s a fit, work is scoped project-by-project around
                what actually needs solving, not a fixed package.
              </p>
            </div>
          </Section>
          <Section title="Get in touch">
            <div className="space-y-6">
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                Tell me what you&apos;re trying to automate.
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
