import { Link } from "react-router-dom";

const features = [
  {
    title: "For patients",
    description: "Track your medicines, receive reminders, and stay on top of prescriptions.",
  },
  {
    title: "For caregivers",
    description: "Monitor schedules, view care plans, and support loved ones with confidence.",
  },
  {
    title: "For admins",
    description: "Keep oversight of the platform with an organized, high-level command center.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.25),_transparent_35%),linear-gradient(135deg,_#020617,_#111827)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between rounded-full border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">PillSync</p>
            <h1 className="text-2xl font-semibold">Medication care, beautifully organized</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-full border border-emerald-400/40 px-5 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Create account
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <p className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
              Intelligent medication support
            </p>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              Welcome to a calmer way to manage care.
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              PillSync helps patients, caregivers, and admins coordinate schedules, prescriptions, and reminders from one polished workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <h3 className="text-xl font-semibold">Choose your role</h3>
            <div className="mt-6 space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
