"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setIsLoading(true);

    const requestBody = JSON.stringify({
      name,
      email,
      password,
      action: "signup",  // Include the action to specify it's a signup request
    });

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Signup successful! Redirecting to login..." });
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        setMessage({ type: "error", text: data.error || "Signup failed. Please try again." });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <FaUser className="text-5xl text-jkuatGreen mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        {message.text && (
          <div
            className={`mt-4 p-3 rounded ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaUser className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full outline-none text-lg bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none text-lg bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none text-lg bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full outline-none text-lg bg-transparent"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-jkuatGreen hover:bg-green-700"
            } text-white`}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-jkuatGreen font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
