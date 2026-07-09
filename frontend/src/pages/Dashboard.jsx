import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>

      <div>

        <h1 className="text-4xl font-bold text-white">
          Welcome back, Snigdha 👋
        </h1>

        <p className="text-slate-400 mt-2">
          Here's a quick overview of your medication management.
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6 mt-10">

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Active Medicines</h3>

          <p className="text-4xl font-bold mt-4 text-emerald-400">
            08
          </p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Today's Doses</h3>

          <p className="text-4xl font-bold mt-4 text-violet-400">
            12
          </p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Upcoming Reminders</h3>

          <p className="text-4xl font-bold mt-4 text-yellow-400">
            03
          </p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Uploaded Prescriptions</h3>

          <p className="text-4xl font-bold mt-4 text-cyan-400">
            05
          </p>
        </div>

      </div>

    </MainLayout>
  );
}