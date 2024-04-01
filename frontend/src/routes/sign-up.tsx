import { SignUp } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="relative h-screen bg-[url('/blurry.svg')] bg-cover bg-center">
      <div className="flex items-center justify-center pt-40">
        <SignUp signInUrl="/sign-in" />
      </div>
    </div>
  );
}
