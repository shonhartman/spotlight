import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Button } from '@/components/Button'

// TODO: replace with your real Formspree endpoint (formspree.io -> create a form -> copy the endpoint URL)
// Until this is replaced, submissions will fail with a 404 from Formspree.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/FORMSPREE_ENDPOINT_PLACEHOLDER'

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

function ConsultingForm() {
  return (
    <form
      action={FORMSPREE_ENDPOINT}
      method="POST"
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <input type="hidden" name="_next" value="https://shaunhartman.com/thank-you" />
      <input type="hidden" name="_subject" value="AI Systems Consulting inquiry" />
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-2 block w-full appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-purple-400 dark:focus:ring-purple-400/10 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-2 block w-full appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-purple-400 dark:focus:ring-purple-400/10 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            What are you looking to automate?
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            className="mt-2 block w-full appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-purple-400 dark:focus:ring-purple-400/10 sm:text-sm"
          />
        </div>
        <Button type="submit">Get in touch</Button>
      </div>
    </form>
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
            <ConsultingForm />
          </Section>
        </div>
      </SimpleLayout>
    </>
  )
}
