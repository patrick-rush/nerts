import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function RulesSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Rule({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Rules',
  description: "Welcome to Nerts! Here are some rules and explanations.",
}

export default function Rules() {
  return (
    <SimpleLayout
      title="Nerts: Game Explanation and Rules"
      intro="Welcome to Nerts, a fast-paced, competitive card game that combines strategy, speed, and a bit of luck. The objective is to score as many points as possible by playing cards to the middle stacks while minimizing points left in your Nert stack. Here&apos;s how you play:"
    >
      <div className="space-y-20">
        <RulesSection title="Setup">
          <Rule title="Online Play">
            A player will need to enter their name and a desired point total to play to.<br />
            When you&apos;re ready, click the start button and a game code will be generated.<br />
            Your friends can join using the game code, after they enter their name.<br />
            Once everybody is in the room, the person that started the game will need to hit the GO! button, and gameplay will begin.<br />
          </Rule>
          <Rule title="The Board">
            Each player starts with their own standard 52-card deck.<br />
            You&apos;ll start with 13 cards in a stack. This is your Nert stack.<br />
            Four face-up cards will be dealt next. This is what we like to call the River.<br />
            The remaining cards are called your Stream.<br />
          </Rule>
        </RulesSection>
        <RulesSection title="Gameplay">
          <Rule title="Playing Cards">
            Play cards from your Stream, River, or Nert stack to the middle stacks, called the Lake.<br />
            Lake stacks must start with an Ace and ascend sequentially up to the King (A-2-3-4-...-Q-K), and cards must be of the same suit.<br />
            Any player can place an Ace in the Lake, and any player can play on any card in the Lake.
            You may play cards from your Nert stack or Stream onto your River if they descend sequentially and alternate in color (e.g., red 6 on a black 7).<br />
          </Rule>
          <Rule title="Movement">
            When a River card is played, you should immediately replace it with the top card from your Nert stack.<br />
            If no moves are available, flip three cards from your River and see if the top card can be played. Continue cycling through your Stream until you can make a move or the game ends.<br />
          </Rule>
          <Rule title="Scoring">
            Each card placed in the middle stacks is worth one point.<br />
            Creating a King stack (completing a sequence to the King in the Lake stacks) grants an additional 3 bonus points.<br />
            At the end of the game, each card of yours in the Lake is positive one point, while each card in your Nert stack is negative one point.<br />
          </Rule>
          <Rule title="Ending the Game">
            When a player depletes their Nert stack, they must quickly hit the &quot;NERT&quot; button to signal the game&apos;s end.<br />
            Other players may continue playing cards to the middle stacks until the game is halted.<br />
          </Rule>
          <Rule title="Winning">
            The winner is the player with the highest score after points are tallied from the Lake, accounting for Kings and cards left in your Nert stack.<br />
            The game may take multiple rounds, depending on the number of points you set to win the game.<br />
          </Rule>
        </RulesSection>
        <RulesSection title="Additional Rules">
          <Rule title="Communication">
            Players should not disclose the contents of their hand or upcoming plays to others.
          </Rule>
          <Rule title="Speed">
            Nerts is played quickly. Players should strive to play as swiftly and accurately as possible.
          </Rule>
          <Rule title="Etiquette">
            Respect your fellow players. While fast and competitive, Nerts should remain friendly and fun.
          </Rule>
        </RulesSection>
      </div>
    </SimpleLayout>
  )
}