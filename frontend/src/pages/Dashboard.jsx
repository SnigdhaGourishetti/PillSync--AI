import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getReminderDashboard } from "../services/reminderService";
import { getMedicines } from "../services/medicineService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_medicines: 0,
    today_reminders: 0,
    upcoming_reminders: 0,
    pending_reminders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await getReminderDashboard();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>

      <div>

        <h1 className="text-4xl font-bold text-white">
          Welcome back 👋
        </h1>

        <p className="text-slate-400 mt-2">
          Here's a quick overview of your medication management.
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6 mt-10">

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Total Medicines</h3>

          <p className="text-4xl font-bold mt-4 text-emerald-400">
            {loading ? "..." : stats.total_medicines}
          </p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Today's Reminders</h3>

          <p className="text-4xl font-bold mt-4 text-violet-400">
            {loading ? "..." : stats.today_reminders}
          </p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Upcoming Reminders</h3>

          <p className="text-4xl font-bold mt-4 text-yellow-400">
            {loading ? "..." : stats.upcoming_reminders}
          </p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 border border-white/10">
          <h3 className="text-slate-400">Pending Reminders</h3>

          <p className="text-4xl font-bold mt-4 text-cyan-400">
            {loading ? "..." : stats.pending_reminders}
          </p>
        </div>

      </div>

    </MainLayout>
  );
}