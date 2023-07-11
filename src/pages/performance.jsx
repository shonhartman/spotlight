import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import actingResume from '@/files/Shaun-Hartman-Acting-Resume.pdf'

function SpeakingSection({ children, ...props }) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Appearance({ title, description, event, cta, href, download }) {
  return (
    <Card as="article">
      <Card.Title as="h3" href={href} download={download}>
        {title}
      </Card.Title>
      <Card.Eyebrow decorate>{event}</Card.Eyebrow>
      <Card.Description>{description}</Card.Description>
      <Card.Cta download={download}>{cta}</Card.Cta>
    </Card>
  )
}

export default function Speaking() {
  return (
    <>
      <Head>
        <title>Performance - Shaun Hartman</title>
        <meta
          name="description"
          content="Shaun Hartman's captivating experience in performance creates a unique blend of artistry and entertainment."
        />
        <meta name="og:title" content="Shaun Hartman | Performance" />
        <meta name="og:image" content="/shaun-portrait.jpg" />
      </Head>
      <SimpleLayout
        title="I’ve performed in Chicago, Toronto, Detroit, San Francisco, Austin, Dallas, Memphis, & Little Rock to name a few... plenty of smaller towns too!"
        intro="One of my favorite ways to express myself is live on stage, to feel that energy transfer from myself to the audience & feel it boomerang right back is an experience that I chase continually."
      >
        <div className="space-y-20">
          <SpeakingSection title="Music">
            <Appearance
              href="https://charlievirgo.com/"
              title="Charlie Virgo"
              description="I've played in a few bands over the years. But, this one has been my favorite by far. We've had the most streams & the best tours with this 2 piece arrangement. Constraining myself to the limitations of playing guitar & bass at the same time have been a wonderful discipline maximizing creativity."
              event="Punk Rock Sinatra"
              cta="Check out Charlie Virgo"
              download={false}
            />
          </SpeakingSection>
          <SpeakingSection title="Acting">
            <Appearance
              href={actingResume}
              title="A discovered talent"
              description="When my son got interested in acting, I tried to provide moral support by auditioning alongside him for Argenta Community Theater's 2019 production of A Christmas Carol. I was surprised that we both got cast & even more surprised to get a leading role! I discovered why I was given that role when I thrived up there on that stage night after night honing the performance & embodying the character. It turns out that all of the hard work I had put into my musical performance over the years translated to an incredible amount of unnoticed acting skill. I was called upon for other roles & asked to audition for other productions which I was cast in. But, then COVID happened & the momentum crashed to a halt. My son lost interest. But, it still lingers in me & I hope satisfy it with many roles to come."
              event="What my son taught me"
              cta="Download Acting Resume"
              download={true}
            />
          </SpeakingSection>
        </div>
      </SimpleLayout>
    </>
  )
}
