import SocialProviders from "@/components/SocialProviders";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Join Today!</h2>
      <SocialProviders />
      <div className="flex items-center gap-2">
        <div className="flex-1 border-t"></div>
        <span className="text-sm text-gray-500">Or sign up with</span>
        <div className="flex-1 border-t"></div>
      </div>
      <AuthForm mode="sign-up" onSubmit={signUp} />
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-black font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
