import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center pt-40">
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}
