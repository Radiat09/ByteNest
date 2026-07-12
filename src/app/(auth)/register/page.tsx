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

export default function RegisterPage() {
  const [name, setName] = useState("");
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Account created but login failed. Please login manually.");
        router.push("/login");
      } else {
        toast.success("Account created successfully");
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setErrorText(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
        Create an Account
      </h1>
      <p className="text-gray-500 mb-8">Enter your details below</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10"
          />
        </div>

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
              minLength={6}
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
              Creating account...
            </span>
          ) : (
            "Create Account"
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
        Sign up with Google
      </Button>

      <p className="text-center mt-8 text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[rgb(219,68,68)] font-medium hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
