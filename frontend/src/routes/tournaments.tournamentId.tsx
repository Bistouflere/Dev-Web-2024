import { useParams } from "react-router-dom";

export default function TournamentProfile() {
  const { tournamentId } = useParams();

  return (
    <div className="container relative">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Tournaments:{tournamentId}
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        This is a public page meant to contain a tournaments form and other
        related tournaments details.
      </p>
    </div>
  );
}
