import { MailIcon } from '../components/icons/Icons'
import { Button } from '@/components/Button'

export default function EmailMe() {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Get in touch</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Tell me how I can make your life easier.
      </p>
      <Button href="mailto:shaunhartman@icloud.com" className="mt-6">
        Email me
      </Button>
    </div>
  )
}
