"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { IoEyeOutline } from "react-icons/io5";
import { RiEyeCloseLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
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
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-10 xl:gap-20 justify-center mx-auto">
        {/* Left side - Image */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            className="w-full h-[500px] lg:h-full object-cover"
            src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/signup/Sign%20Up.webp"
            alt="Sign Up"
          />
        </div>

        {/* Right side - Form */}
        <div className="lg:w-1/2 lg:h-screen flex lg:items-center">
          <div className="max-w-[500px] w-full md:shadow-2xl lg:shadow-none bg-white py-5 lg:py-20 px-10">
            <h1 className="font-[var(--font-inter)] font-medium text-2xl lg:text-3xl">
              Create an Account
            </h1>

            <p className="mt-10 lg:mt-5 font-medium">Enter your detail below</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="outline-none mt-8 py-2 w-full border-b-2 border-gray-400 focus:border-black transition-colors"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="text"
                className="outline-none mt-8 py-2 w-full border-b-2 border-gray-400 focus:border-black transition-colors"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="flex mt-8 py-2 w-full border-b-2 border-gray-400 focus-within:border-black transition-colors items-center">
                <input
                  className="outline-none w-full"
                  placeholder="Password"
                  type={passView ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <span
                  onClick={() => setPassView(!passView)}
                  className="pr-2 text-xl cursor-pointer"
                >
                  {passView ? <IoEyeOutline /> : <RiEyeCloseLine />}
                </span>
              </div>

              {errorText && (
                <p className="text-red-500 mt-4 text-sm">{errorText}</p>
              )}

              <button
                type="submit"
                className="mt-4 bg-[rgb(219,68,68)] text-white w-full rounded-md py-2.5 font-medium hover:bg-[rgb(200,55,55)] transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex gap-2 justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Account ...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="mt-2 border border-gray-300 w-full rounded-md py-2.5 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>

            <p className="text-center mt-8">
              Already have an account?{" "}
              <Link
                href="/login"
                className="ml-2 text-[rgb(219,68,68)] border-b-2 border-[rgb(219,68,68)] pb-1"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
