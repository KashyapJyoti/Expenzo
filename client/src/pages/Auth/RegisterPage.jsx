import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export const RegisterPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-4">
      <div className="max-w-md w-full card shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-lg">₹</span>
          </div>
          <div>
            <p className="font-semibold text-slate-50 tracking-tight text-lg">
              Create your Expenzo
            </p>
            <p className="text-xs text-slate-400">
              Simple, opinionated money tracking
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs mb-1 text-slate-400">
              Full name
            </label>
            <input
              type="text"
              name="name"
              required
              className="input"
              placeholder="Priya Sharma"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="input"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4">
          Already have an Expenzo account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

