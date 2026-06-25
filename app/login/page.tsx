"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

function getRedirectPath(role: string) {
  if (role === "ADMIN") return "/admin";
  return "/buyer/dashboard";
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("buyer@nobleaddis.com");
  const [password, setPassword] = useState("buyer123");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to sign in.");
        setIsLoading(false);
        return;
      }

      router.push(getRedirectPath(data.user.role));
      router.refresh();
    } catch {
      setMessage("Unable to sign in. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <LockKeyhole size={24} />
        </div>

        <p className="small-label">Account access</p>
        <h1>Sign in to Noble Addis</h1>
        <p>Access your buyer or admin dashboard.</p>

        <form onSubmit={handleLogin} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          {message && <p className="auth-message">{message}</p>}
        </form>

        <div className="auth-demo-users">
          <p>Test accounts</p>
          <span>Buyer: buyer@nobleaddis.com / buyer123</span>
          <span>Super Admin: admin@nobleaddis.com / nobleaddis123</span>
          <span>Listings Admin: listings@nobleaddis.com / listings123</span>
          <span>Finance Admin: finance@nobleaddis.com / finance123</span>
          <span>Verification Admin: verify@nobleaddis.com / verify123</span>
          <span>Support Admin: support@nobleaddis.com / support123</span>
        </div>
      </section>
    </main>
  );
}