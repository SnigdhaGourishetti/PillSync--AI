import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import { getMedicines } from "../../services/medicineService";
import { getReminders } from "../../services/reminderService";
import { getPrescriptions } from "../../services/prescriptionService";
import { FaCapsules, FaClock, FaFileMedical, FaChartLine, FaPrescriptionBottleAlt, FaBell, FaHeartbeat } from "react-icons/fa";

const patientTasks = [
  "Take morning tablet at 08:00",
  "Upload updated prescription",
  "Set reminder for next refill",
];

const adherencePoints = [
  "Medication adherence: 95%",
  "Refill alert: 2 days remaining",
  "Last prescription uploaded: 2 days ago",
];

export default function Dashboard() {
  const [stats, setStats] = useState({ medicines: 0, reminders: 0, prescriptions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [medicines, reminders, prescriptions] = await Promise.all([
          getMedicines(),
          getReminders(),
          getPrescriptions(),
        ]);
        setStats({
          medicines: medicines.length,
          reminders: reminders.length,
          prescriptions: prescriptions.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Patient dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Manage your care plan with confidence.</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Track medicines, reminders, prescriptions, adherence, and refill alerts in one place.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">Loading dashboard...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Medicines" value={stats.medicines} icon={<FaCapsules />} color="text-emerald-400" />
          <StatCard title="Reminders" value={stats.reminders} icon={<FaClock />} color="text-yellow-400" />
          <StatCard title="Prescriptions" value={stats.prescriptions} icon={<FaFileMedical />} color="text-cyan-400" />
          <StatCard title="Adherence" value="95%" icon={<FaChartLine />} color="text-violet-400" />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-xl font-semibold text-white">Today’s care actions</h2>
          <div className="mt-5 space-y-3">
            {patientTasks.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-300">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-xl font-semibold text-white">Health overview</h2>
          <div className="mt-5 space-y-3">
            {adherencePoints.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-300">
                <FaHeartbeat className="text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}