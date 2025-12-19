import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      toast.success("If the email exists, reset instructions were sent.");
    } catch (e) {
      toast.error("Failed to request reset");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 card p-6">
      <h1 className="text-xl font-bold mb-4 text-text">Reset Password</h1>
      <form onSubmit={submit} className="space-y-3" aria-label="Forgot password form">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full mt-1"/>
        </div>
        <button className="btn btn-primary w-full" type="submit" aria-label="Send reset">Send reset link</button>
        <div className="text-sm">
          <Link to="/login" className="text-primary">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
