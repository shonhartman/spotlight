import Head from 'next/head'

import { SimpleLayout } from '@/components/SimpleLayout'

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>Thanks - Shaun Hartman</title>
        <meta
          name="description"
          content="Thanks for reaching out."
        />
      </Head>
      <SimpleLayout
        title="Thanks for reaching out."
        intro="I’ll get back to you soon. If you signed up for the newsletter, I’ll send you an email any time I publish a new blog post, release a new project, or have anything interesting to share. You can unsubscribe at any time, no hard feelings."
      />
    </>
  )
}
