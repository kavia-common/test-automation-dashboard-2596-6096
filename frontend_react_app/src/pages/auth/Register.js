import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      toast.success("Account created");
      nav("/");
    } catch (e) {
      toast.error(e.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 card p-6">
      <h1 className="text-xl font-bold mb-4 text-text">Register</h1>
      <form onSubmit={submit} className="space-y-3" aria-label="Register form">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full mt-1"/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="w-full mt-1"/>
        </div>
        <button className="btn btn-primary w-full" type="submit" aria-label="Register">Create Account</button>
        <div className="text-sm">
          <Link to="/login" className="text-primary">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
