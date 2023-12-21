import Link from 'next/link'
import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import { PlayingCard } from '@/components/PlayingCard'
import { ranks, suits } from '@/constants/nerts'
import { motion } from 'framer-motion'
import { DisplayOnlyPlayingCard } from '@/components/DisplayOnlyPlayingCard'

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

export default async function Home() {
  "use client"

  return (
    <>
      <Container className="absolute top-36 left-1/4 right-1/4 text-balance">
        {/* <div className="max-w-2xl"> */}
        <div className="mx-auto text-center">
          <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            NERTS
          </h1>
          <div className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              Nerts is a fast-paced, multi-player card game that combines the excitement of Solitaire with the competitive edge of a race. Players simultaneously build sequences of cards while trying to outmaneuver their opponents. It's a dynamic, energetic experience that tests your speed, strategy, and adaptability. Dive into Nerts, where quick thinking and a sharp eye can lead you to victory!
            </p>
            {/* <p>
              Join me on this journey where software engineering meets artistry, and let&apos;s create something beautiful together.
            </p>
            <p>
              I am currently open to contract and full-time employment. Please don&apos;t hesitate to reach out if you would like to connect!
            </p> */}
            <Link href="/nerts" >
              <DisplayOnlyPlayingCard className="mt-8" suit={suits[3]} rank={ranks[0]} isShowing/>
            </Link>
          </div>
          {/* socials */}
          {/* <div className="mt-6 flex gap-6">
            <SocialLink
              href={`${process.env.TWITTER_URL}`}
              aria-label="Follow on Twitter"
              icon={TwitterIcon}
            />
            <SocialLink
              href={`${process.env.INSTAGRAM_URL}`}
              aria-label="Follow on Instagram"
              icon={InstagramIcon}
            />
            <SocialLink
              href={`${process.env.GITHUB_URL}`}
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href={`${process.env.LINKEDIN_URL}`}
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div> */}
          {/* <PlayingCard className="blur-sm" suit={suits[3]} rank={ranks[0]} isShowing /> */}
            </div>
          </div>
      </Container>
      <div className="overflow-hidden">
          {/* <DisplayOnlyPlayingCard className="absolute top-1/2 left-1/2 z-[-10] shadow-md shadow-zinc-800 rounded-lg overflow-hidden" suit={suits[3]} rank={ranks[0]} scale={[1.5, 2, 2.5, 2, 1.5, 1.25, 1.5]} isShowing />
          <DisplayOnlyPlayingCard className="absolute top-1/4 left-1/4 z-[-12] shadow-md shadow-zinc-800 rounded-lg overflow-hidden" suit={suits[2]} rank={ranks[4]} scale={[1.25, 1.5, 1.5, 2, 2.5, 2, 1.5]} isShowing />
          <DisplayOnlyPlayingCard className="absolute top-3/4 left-1/2 z-[-14] shadow-md shadow-zinc-800 rounded-lg overflow-hidden" suit={suits[1]} rank={ranks[8]} scale={[2.5, 2, 1.5, 1.25, 1.5, 1.5, 2]} isShowing />
          <DisplayOnlyPlayingCard className="absolute top-1/2 left-3/4 z-[-16] shadow-md shadow-zinc-800 rounded-lg overflow-hidden" suit={suits[0]} rank={ranks[12]} scale={[1.5, 2, 2.5, 2, 1.5, 1.25, 1.5]} isShowing /> */}
      </div>
    </>
  )
}
