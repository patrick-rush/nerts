import { Container } from '@/components/Container'

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title?: string
  intro: string
  children?: React.ReactNode
}) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="">
        <h1 className="flex justify-center text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl text-center">
          {title}
        </h1>
        <div className="flex justify-center">
          <p className="max-w-2xl mt-6 text-base text-zinc-600 dark:text-zinc-400 text-center">
            {intro}
          </p>
        </div>
      </header>
      {children && <div className="mt-8">{children}</div>}
    </Container>
  )
}
