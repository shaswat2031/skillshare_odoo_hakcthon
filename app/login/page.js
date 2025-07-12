"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save user to localStorage
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Redirect to home page
        router.push("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Skill Swap Platform
              </h1>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                Forgot username/password?
              </a>
            </div>

            <div className="mt-8 text-center">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-800 text-sm border border-gray-300 px-4 py-2 rounded-md"
              >
                Home
              </a>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
              <p className="text-xs text-gray-500">
                Email: marc@demo.com, Password: password123
                <br />
                Email: michell@demo.com, Password: password123
                <br />
                Email: joe@demo.com, Password: password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
