import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login, loginSample, mockMode } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("sample@demo.local");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in");
      nav("/");
    } catch (e) {
      toast.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const sample = async () => {
    try {
      await loginSample();
      toast.success("Logged in (sample)");
      nav("/");
    } catch {
      toast.error("Sample login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 card p-6">
      <h1 className="text-xl font-bold mb-4 text-text">Login</h1>
      <form onSubmit={submit} className="space-y-3" aria-label="Login form">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full mt-1"/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="w-full mt-1"/>
        </div>
        <button disabled={loading} className="btn btn-primary w-full" type="submit" aria-label="Login">
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="flex items-center justify-between text-sm">
          <Link to="/register" className="text-primary">Create account</Link>
          <Link to="/forgot" className="text-primary">Forgot password</Link>
        </div>
      </form>
      <div className="mt-4">
        <button className="btn btn-secondary w-full" onClick={sample} aria-label="Login sample">
          {mockMode ? "Sign in with sample account" : "Use sample (mock) mode"}
        </button>
      </div>
    </div>
  );
}
