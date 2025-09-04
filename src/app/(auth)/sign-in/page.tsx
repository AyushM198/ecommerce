import SocialProviders from "@/components/SocialProviders";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome Back</h2>
      <SocialProviders />
      <div className="flex items-center gap-2">
        <div className="flex-1 border-t"></div>
        <span className="text-sm text-gray-500">Or sign in with</span>
        <div className="flex-1 border-t"></div>
      </div>
      <AuthForm mode="sign-in" onSubmit={signIn} />
      <p className="text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/sign-up" className="text-black font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
