import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({ title, href, children }) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export default function Uses() {
  return (
    <>
      <Head>
        <title>Growth - Shaun Hartman</title>
        <meta
          name="description"
          content="It's important to keep growing as a person. But, it is also important to contribute to the growth of humanity."
        />
      <meta name="og:title" content="Shaun Hartman | Growth" />
      <meta name="og:image" content="/shaun-portrait.jpg" />
      </Head>
      <SimpleLayout
        title="Personal growth is essential. But, contributing to the growth of humanity is of paramount importance."
        intro="If you're not growing, your dying. If you're not part of the solution, you're part of the problem."
      >
        <div className="space-y-20">
          <ToolsSection title="Personal Growth">
            <Tool title="Yoga">
              I am not trying to get old anytime soon. Science keeps unraveling the mysteries
              of the human body & I am listening. I am applying it too. I have put together a 
              curriculum for maintaining & enhancing the body throughout life. We may not be 
              able to stop the aging process. But, we can certainly elevate our joy by keeping 
              the body highly mobile & free from illness.
            </Tool>
            <Tool title="Mindfulness">
              During the pandemic of 2020, I discovered another ancient tool for greater health, 
              greater mental health. Which, it turns out, is the key to all health. After all, we
              do have to initiate any action toward health in the mind. I started with the Calm app,
              then I added the Oye app built by Big Human. It has changed my life for the better
              in every way.
            </Tool>
            <Tool title="Education">
              In software engineering, learning must be fast & constant. That is one reason it
              has been such a good fit for me. I have always devoured knowledge. In late 2022, AI 
              technologies have accelerated this rabid pursuit of knowledge exponentially. I am so 
              excited to see how far it will take me.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Human development">
            <Tool title="Diversity, Equity, & Inclusion">
              Working for the Boys & Girls Club opened my eyes to the struggles that our 
              society have inflicted on so many. Since then, I have tried to seize & create
              any opportunity that may make a difference. I have taken my lumps along the way.
              But, it is nothing compared to the fight that others are born into. I will keep 
              doing what I can with what I have wherever I am. Got an idea of how to help?
              Let me know. Let&apos;s team up.
            </Tool>
            <Tool title="Collaboration">              
              I believe an aptitude for working with people is absolutely essential. 
              I have been happy to continue my practice in the Art of Humanity 
              working with development teams, account executives, project managers, 
              & clients to achieve some lofty goals all centered around the best possible 
              experience for a potential user. Success can only be achieved with a genuine 
              interest in the needs of each person along the way. It is the individual who is not 
              interested in his fellow man who has the greatest difficulties in life and provides 
              the greatest injury to others. It is from among such individuals that all human 
              failures spring. To be a good coworker & teammate, I strive to put myself out to 
              encourage & support other people - cultivating a prosperous atmosphere fueled by 
              the positive energy of unselfishness & thoughtfulness.
              I love to do whatever I can to help people around me grow, as well. 
              I feel that kind of growth compounds, benefitting everyone involved.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Productivity">
            <Tool title="Work Ethic">
              Just out of High School, I was curious how building songs would relate to 
              building a house. So, I applied as a carpenter&apos;s assistant. For the next 
              four years I practiced sweating, bleeding, and eventually... I began to 
              learn the trade. Carpentry is an interesting mix of mathematics, problem solving, 
              and sheer grit. I find many similarities to software development. I watched old men 
              destroy their bodies and just laugh it off passing invaluable wisdom through crass 
              stories and thick country accents. I learned a great deal about life. But, most of 
              all, I learned how to work... hard... and long... until there is a structure that 
              someone can call a home.
            </Tool>
            <Tool title="Time Management">
              Using a daily notes system instead of trying to keep things
              organized by topics has been super powerful for me. And with
              Reflect, it’s still easy for me to keep all of that stuff
              discoverable by topic even though all of my writing happens in the
              daily note.
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
