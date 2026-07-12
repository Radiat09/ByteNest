"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passView, setPassView] = useState(false);
  const [errorText, setErrorText] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorText("Invalid email or password");
      } else {
        toast.success("Logged in successfully");
        router.push("/");
        router.refresh();
      }
    } catch {
      setErrorText("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
        Log in to ByteNest
      </h1>
      <p className="text-gray-500 mb-8">Enter your details below</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={passView ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setPassView(!passView)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={passView ? "Hide password" : "Show password"}
            >
              {passView ? (
                <IoEyeOutline className="size-5" />
              ) : (
                <IoEyeOffOutline className="size-5" />
              )}
            </button>
          </div>
        </div>

        {errorText && (
          <p role="alert" className="text-sm text-red-500">
            {errorText}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-[rgb(219,68,68)] text-white hover:bg-[rgb(200,55,55)] cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#F5F5F5] px-4 text-gray-400">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full h-10 cursor-pointer"
      >
        <FcGoogle className="size-5" />
        Sign in with Google
      </Button>

      <p className="text-center mt-8 text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[rgb(219,68,68)] font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
