import GameContainer from "@/components/game/GameContainer";
import SpaceBackground from "@/components/game/SpaceBackground";

// Disable static pre-rendering since Wagmi context is required
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <SpaceBackground />
      <GameContainer />
    </main>
  );
}
