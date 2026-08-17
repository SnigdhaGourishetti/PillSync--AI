import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getReminderAnalytics } from "../../services/reminderService";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysWindow, setDaysWindow] = useState(30);

  useEffect(() => {
    loadAnalyticsData();
  }, [daysWindow]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await getReminderAnalytics(daysWindow);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError(err.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Loading analytics...</p>
        </div>
      </MainLayout>
    );
  }

  const taken = analytics?.taken_count || 0;
  const missed = analytics?.missed_count || 0;
  const snoozed = analytics?.snoozed_count || 0;
  const adherencePercent = analytics?.adherence_percentage_strict || 0;
  const lowStockCount = analytics?.summary?.medicines_with_low_stock || 0;
  const dailyData = analytics?.daily || [];
  const medicineBreakdown = analytics?.medicine_breakdown || [];
  const refillItems = analytics?.refill_insights?.items || [];

  // Chart 1: Daily Adherence Trend (Last 14 days)
  const dailyAdherenceChart = {
    labels: dailyData
      .slice(-14)
      .map((d) =>
        new Date(d.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
    datasets: [
      {
        label: "Adherence %",
        data: dailyData.slice(-14).map((d) => d.adherence_percentage),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart 2: Dose Outcomes Distribution
  const doseOutcomesChart = {
    labels: ["Taken", "Missed", "Snoozed"],
    datasets: [
      {
        data: [taken, missed, snoozed],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
        borderColor: "#1f2937",
        borderWidth: 2,
      },
    ],
  };

  // Chart 3: Medicine-wise Adherence
  const medicineAdherenceChart = {
    labels: medicineBreakdown.map((m) => m.medicine_name),
    datasets: [
      {
        label: "Adherence %",
        data: medicineBreakdown.map((m) => m.adherence_percentage),
        backgroundColor: "#3b82f6",
        borderColor: "#1f2937",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#cbd5e1",
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "#334155", drawBorder: false },
      },
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "#334155", drawBorder: false },
      },
    },
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-slate-400 mt-2">
              {analytics?.window?.start_date && analytics?.window?.end_date
                ? `Showing data from ${analytics.window.start_date} to ${analytics.window.end_date}`
                : "Medication adherence and stock analysis"}
            </p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setDaysWindow(days)}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  daysWindow === days
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {days}d
              </button>
            ))}
            <button
              onClick={loadAnalyticsData}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium ml-2"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 rounded-lg p-4 mb-4">
            <p className="font-semibold">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-emerald-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Adherence Rate</p>
          <p className="text-4xl font-bold text-emerald-400 mt-2">{adherencePercent.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-2">30-day average</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-green-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Doses Taken</p>
          <p className="text-4xl font-bold text-green-400 mt-2">{taken}</p>
          <p className="text-xs text-slate-500 mt-2">In selected window</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-red-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Doses Missed</p>
          <p className="text-4xl font-bold text-red-400 mt-2">{missed}</p>
          <p className="text-xs text-slate-500 mt-2">Needs attention</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-orange-500/30 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Low Stock Items</p>
          <p className="text-4xl font-bold text-orange-400 mt-2">{lowStockCount}</p>
          <p className="text-xs text-slate-500 mt-2">Refill required</p>
        </div>
      </div>

      {/* Charts Row 1: Trend and Outcomes */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#0f1724] rounded-lg p-6 border border-white/5 shadow-lg">
          <h3 className="text-white font-semibold text-lg mb-4">Daily Adherence Trend</h3>
          <p className="text-slate-400 text-xs mb-4">Last 14 days</p>
          <div style={{ height: 300 }}>
            <Line
              data={dailyAdherenceChart}
              options={{
                ...chartOptions,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        <div className="bg-[#0f1724] rounded-lg p-6 border border-white/5 shadow-lg">
          <h3 className="text-white font-semibold text-lg mb-4">Dose Outcomes</h3>
          <p className="text-slate-400 text-xs mb-4">Distribution across window</p>
          <div style={{ height: 300 }}>
            <Doughnut data={doseOutcomesChart} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Medicine-wise Adherence Chart */}
      <div className="bg-[#0f1724] rounded-lg p-6 border border-white/5 shadow-lg mb-6">
        <h3 className="text-white font-semibold text-lg mb-4">Medicine-wise Adherence</h3>
        <p className="text-slate-400 text-xs mb-4">Adherence rate per medicine</p>
        {medicineBreakdown.length > 0 ? (
          <div style={{ height: 300 }}>
            <Bar data={medicineAdherenceChart} options={chartOptions} />
          </div>
        ) : (
          <div className="text-slate-400 text-center py-12">
            No medicine data available
          </div>
        )}
      </div>

      {/* Refill & Stock Table */}
      <div className="bg-[#0f1724] rounded-lg p-6 border border-white/5 shadow-lg">
        <h3 className="text-white font-semibold text-lg mb-2">Refill & Stock Status</h3>
        <p className="text-slate-400 text-xs mb-4">
          Current inventory and predicted refill dates
        </p>

        {refillItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 px-4 py-4 font-semibold">
                    Medicine
                  </th>
                  <th className="text-center text-slate-400 px-4 py-4 font-semibold">
                    Stock
                  </th>
                  <th className="text-center text-slate-400 px-4 py-4 font-semibold">
                    Days Remaining
                  </th>
                  <th className="text-center text-slate-400 px-4 py-4 font-semibold">
                    Predicted Run-out
                  </th>
                  <th className="text-center text-slate-400 px-4 py-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {refillItems.map((item) => (
                  <tr
                    key={item.medicine_id}
                    className="border-b border-slate-800 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-4 text-white font-medium">
                      {item.medicine_name}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300">
                      {item.stock_quantity}{" "}
                      <span className="text-xs text-slate-500">units</span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300 font-medium">
                      {item.days_remaining}{" "}
                      <span className="text-xs text-slate-500">days</span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300">
                      {item.predicted_run_out_date}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.needs_refill ? (
                        <span className="inline-block bg-red-600/20 text-red-300 text-xs px-3 py-2 rounded-full font-semibold border border-red-500/50">
                          🔴 Low Stock
                        </span>
                      ) : item.upcoming_refill ? (
                        <span className="inline-block bg-yellow-600/20 text-yellow-300 text-xs px-3 py-2 rounded-full font-semibold border border-yellow-500/50">
                          🟡 Refill Soon
                        </span>
                      ) : (
                        <span className="inline-block bg-green-600/20 text-green-300 text-xs px-3 py-2 rounded-full font-semibold border border-green-500/50">
                          🟢 Stable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-slate-400 text-center py-12">
            <p className="text-sm">No medicines in your profile yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Add medicines to see refill insights and stock status.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
