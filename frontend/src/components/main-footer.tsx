import { Link } from "react-router-dom";

export function MainFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2024{" "}
          <Link to="/" className="font-medium underline underline-offset-4">
            MadBracket.xyz
          </Link>
          . The source code is available on{" "}
          <Link
            to="https://github.com/Bistouflere/Dev-Web-2024"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
