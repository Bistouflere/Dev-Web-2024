import Balancer from "react-wrap-balancer";

export default function NotFoundPage() {
  return (
    <div className="relative h-screen">
      <div className="flex items-center justify-center pt-40">
        <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            404
          </h1>
          <Balancer className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
            The page you are looking for doesn't exist. Please check the URL and
            try again.
          </Balancer>
        </section>
      </div>
    </div>
  );
}
