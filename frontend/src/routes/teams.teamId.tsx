import { useParams } from "react-router-dom";

export default function TeamProfile() {
  const { teamId } = useParams();

  return (
    <div className="container relative">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Teams:{teamId}
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        This is a public page meant to contain a teams form and other related
        teams details.
      </p>
    </div>
  );
}
