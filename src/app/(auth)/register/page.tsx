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
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2 tracking-tight">
          Create an Account
        </h1>
        <p className="text-gray-500">Enter your details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={passView ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 rounded-xl pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setPassView(!passView)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={passView ? "Hide password" : "Show password"}
            >
              {passView ? <IoEyeOutline className="size-5" /> : <IoEyeOffOutline className="size-5" />}
            </button>
          </div>
        </div>

        {errorText && (
          <p role="alert" className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{errorText}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-brand text-white hover:bg-brand/90 cursor-pointer rounded-xl font-medium"
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
          <span className="bg-gray-50 px-4 text-gray-400">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full h-11 cursor-pointer rounded-xl font-medium"
      >
        <FcGoogle className="size-5" />
        Sign up with Google
      </Button>

      <p className="text-center mt-8 text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-brand font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
