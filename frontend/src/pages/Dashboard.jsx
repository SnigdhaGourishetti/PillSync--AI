import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getReminderDashboard } from "../services/reminderService";
import { Link } from "react-router-dom";

function Donut({ percent, size = 96, stroke = 10, color = "#34d399" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="mx-auto">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1f2937"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        fill="none"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-white font-bold"
        style={{ fontSize: 14 }}
      >
        {percent}%
      </text>
    </svg>
  );
}

function LineTrend({ data = [] }) {
  if (!data.length) return <div className="text-slate-400">No trend data</div>;
  const width = 300;
  const height = 80;
  const max = Math.max(...data.map((d) => d.adherence_percentage), 100);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * width;
      const y = height - (d.adherence_percentage / max) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke="#60a5fa"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_medicines: 0,
    today_reminders: 0,
    upcoming_reminders: 0,
    pending_reminders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getReminderDashboard();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome back 👋</h1>
        <p className="text-slate-400 mt-2">
          Here's a quick overview of your medication management.
        </p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 rounded-lg p-4 mb-6">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-emerald-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Total Medicines</p>
          <p className="text-4xl font-bold text-emerald-400 mt-3">
            {loading ? "..." : stats.total_medicines}
          </p>
          <p className="text-xs text-slate-500 mt-2">Active in profile</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-violet-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Today's Reminders</p>
          <p className="text-4xl font-bold text-violet-400 mt-3">
            {loading ? "..." : stats.today_reminders}
          </p>
          <p className="text-xs text-slate-500 mt-2">Due today</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-yellow-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Upcoming Reminders</p>
          <p className="text-4xl font-bold text-yellow-400 mt-3">
            {loading ? "..." : stats.upcoming_reminders}
          </p>
          <p className="text-xs text-slate-500 mt-2">Next 7 days</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-cyan-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Pending Reminders</p>
          <p className="text-4xl font-bold text-cyan-400 mt-3">
            {loading ? "..." : stats.pending_reminders}
          </p>
          <p className="text-xs text-slate-500 mt-2">Awaiting action</p>
        </div>
      </div>

      {/* Quick Actions & Analytics Link */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#0f1724] rounded-lg p-6 border border-white/5 shadow-lg">
          <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={loadDashboardData}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
            >
              ↻ Refresh Dashboard
            </button>
            <Link
              to="/analytics"
              className="block w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm text-center"
            >
              📊 View Analytics
            </Link>
          </div>
        </div>

        <div className="bg-[#0f1724] rounded-lg p-6 border border-white/5 shadow-lg">
          <h2 className="text-white font-semibold text-lg mb-4">Analytics Summary</h2>
          <p className="text-slate-400 text-sm mb-4">
            Track your medication adherence, stock levels, and predicted refill dates.
          </p>
          <Link
            to="/analytics"
            className="inline-block px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition font-medium text-sm"
          >
            Go to Analytics →
          </Link>
        </div>
      </div>

      {/* Recent History */}
      {stats.recent_history && stats.recent_history.length > 0 && (
        <div className="mt-8 bg-[#0f1724] rounded-lg p-6 border border-white/5 shadow-lg">
          <h2 className="text-white font-semibold text-lg mb-4">Recent Activity</h2>
          <div className="divide-y divide-slate-700 max-h-64 overflow-auto">
            {stats.recent_history.map((activity, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-white text-sm font-medium">
                    {activity.medicine_name}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {activity.date} at {activity.time}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    activity.status === "TAKEN"
                      ? "bg-green-600/20 text-green-300"
                      : activity.status === "MISSED"
                      ? "bg-red-600/20 text-red-300"
                      : "bg-yellow-600/20 text-yellow-300"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}