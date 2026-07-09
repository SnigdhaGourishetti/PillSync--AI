import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const roleOptions = [
  { value: "PATIENT", label: "Patient" },
  { value: "CAREGIVER", label: "Caregiver" },
  { value: "ADMIN", label: "Admin" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "PATIENT",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerUser(form);
      setSuccess("Account created successfully. Redirecting you to sign in...");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      const message = err.response?.data?.detail || "We could not create your account right now.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_35%),linear-gradient(135deg,_#020617,_#111827)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:flex-row lg:p-10">
        <div className="w-full max-w-lg">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Create account</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Join PillSync and personalize your care experience.</h1>
          <p className="mt-4 text-lg text-slate-300">
            Register as a patient, caregiver, or admin and get a beautiful dashboard for your role.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl">
          <h2 className="mb-2 text-2xl font-semibold">Sign up</h2>
          <p className="mb-6 text-sm text-slate-400">Create your account in a minute.</p>

          {error ? <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
          {success ? <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</div> : null}

          <label className="mb-2 block text-sm text-slate-300">Username</label>
          <input name="username" value={form.username} onChange={handleChange} required className="mb-4 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400" />

          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="mb-4 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400" />

          <label className="mb-2 block text-sm text-slate-300">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required className="mb-4 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400" />

          <label className="mb-2 block text-sm text-slate-300">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="mb-4 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400">
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <label className="mb-2 block text-sm text-slate-300">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="mb-6 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400" />

          <button type="submit" className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-400">
            Create account
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-emerald-300">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}