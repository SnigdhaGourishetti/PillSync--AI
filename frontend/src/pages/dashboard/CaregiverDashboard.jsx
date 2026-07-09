import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

export default function CaregiverDashboard() {
  const [data, setData] = useState({ caregiver: null, patients: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await api.get("/accounts/assignments/");
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const tasks = (data.patients || []).map((patient) => ({
    name: patient.task || `Check ${patient.username}`,
    time: patient.caregiver_shift || "Morning",
    patient: patient.username,
    status: "Assigned",
    importantInfo: patient.important_info || "Review medication schedule and adherence.",
    nextStep: patient.next_step || "Confirm refill and update notes.",
  }));

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Caregiver dashboard</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Monitor assigned patients with real-time care insight.</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Review your assigned patients, their shifts, and the care schedule for the day.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-slate-300">Loading assignments...</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h3 className="text-slate-400">Assigned patients</h3>
                <p className="mt-4 text-4xl font-bold text-emerald-400">{data.patients?.length || 0}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h3 className="text-slate-400">Shift</h3>
                <p className="mt-4 text-4xl font-bold text-cyan-400">{data.caregiver?.caregiver_shift || "Morning"}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h3 className="text-slate-400">Care status</h3>
                <p className="mt-4 text-4xl font-bold text-violet-400">Active</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h2 className="text-xl font-semibold text-white">Assigned patient tasks</h2>
                <div className="mt-5 space-y-3">
                  {tasks.map((task) => (
                    <div key={task.patient} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-300">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-white">{task.name}</p>
                          <p className="text-sm text-slate-400">Patient: {task.patient}</p>
                          <p className="mt-2 text-sm text-slate-300">{task.importantInfo}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-emerald-300">
                          <p>{task.time}</p>
                          <p className="text-xs text-slate-400">{task.status}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-400">Next: {task.nextStep}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h2 className="text-xl font-semibold text-white">Shift summary</h2>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-300">
                    Your assigned shift is {data.caregiver?.caregiver_shift || "Morning"}.
                  </div>
                  <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="font-semibold text-emerald-200">Assigned patients</p>
                    <div className="mt-2 space-y-2">
                      {(data.patients || []).map((patient) => (
                        <p key={patient.id} className="text-sm text-slate-300">• {patient.username} — {patient.caregiver_shift || "Morning"}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
