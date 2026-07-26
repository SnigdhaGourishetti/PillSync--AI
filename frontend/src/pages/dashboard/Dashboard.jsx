import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import { getReminderDashboard } from "../../services/reminderService";
import { FaCapsules, FaClock, FaCheckCircle, FaTimesCircle, FaBell, FaHeartbeat } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getReminderDashboard();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "TAKEN":
        return "bg-emerald-500/20 text-emerald-400";
      case "MISSED":
        return "bg-rose-500/20 text-rose-400";
      case "SNOOZED":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Patient dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Manage your care plan with confidence.</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Track medicines, reminders, adherence, and medication history in one place.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-500/20 border border-rose-500/50 p-4 text-rose-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Medicines" value={stats?.total_medicines || 0} icon={<FaCapsules />} color="text-emerald-400" />
            <StatCard title="Total Reminders" value={stats?.total_reminders || 0} icon={<FaClock />} color="text-yellow-400" />
            <StatCard title="Today's Completed" value={stats?.today_completed || 0} icon={<FaCheckCircle />} color="text-cyan-400" />
            <StatCard title="Missed Medications" value={stats?.missed_medications || 0} icon={<FaTimesCircle />} color="text-rose-400" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Reminder</h2>
              {stats?.upcoming_reminder ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-3">
                    <FaBell className="text-yellow-400 text-2xl" />
                    <div>
                      <p className="text-lg font-semibold text-white">{stats.upcoming_reminder.medicine_name}</p>
                      <p className="text-sm text-slate-400">Time: {stats.upcoming_reminder.reminder_time}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 p-4 text-slate-400">
                  No upcoming reminders
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
              <h2 className="text-xl font-semibold text-white">Status Summary</h2>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <span className="text-slate-300">Taken</span>
                  <span className="text-emerald-400 font-semibold">{stats?.status_summary?.taken || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <span className="text-slate-300">Missed</span>
                  <span className="text-rose-400 font-semibold">{stats?.status_summary?.missed || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <span className="text-slate-300">Snoozed</span>
                  <span className="text-blue-400 font-semibold">{stats?.status_summary?.snoozed || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-xl font-semibold text-white">Recent Medication History</h2>
            {stats?.recent_history && stats.recent_history.length > 0 ? (
              <div className="mt-5 space-y-3">
                {stats.recent_history.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                    <div>
                      <p className="text-white font-semibold">{item.medicine_name}</p>
                      <p className="text-sm text-slate-400">{item.date} at {item.time}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 p-4 text-slate-400">
                No recent medication history
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
}