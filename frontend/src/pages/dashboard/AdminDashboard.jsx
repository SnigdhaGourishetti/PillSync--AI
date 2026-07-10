import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

export default function AdminDashboard() {
  const [data, setData] = useState({ caregivers: [], patients: [] });
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

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Admin command center</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Coordinate care operations from one control panel.</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Manage users, assign caregivers, and manage patient schedules from one place.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-slate-300">Loading assignments...</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h3 className="text-slate-400">Patients</h3>
                <p className="mt-4 text-4xl font-bold text-emerald-400">{data.patients?.length || 0}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h3 className="text-slate-400">Caregivers</h3>
                <p className="mt-4 text-4xl font-bold text-cyan-400">{data.caregivers?.length || 0}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h3 className="text-slate-400">Assigned patients</h3>
                <p className="mt-4 text-4xl font-bold text-violet-400">{data.patients?.filter((p) => p.assigned_caregiver).length || 0}</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
                <h2 className="text-xl font-semibold text-white">Current assignments</h2>
                <div className="mt-5 space-y-3">
                  {(data.patients || []).filter((patient) => patient.assigned_caregiver).map((patient) => (
                    <div key={patient.id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-300">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-white">{patient.username}</p>
                          <p className="text-sm text-slate-400">Caregiver: {patient.assigned_caregiver_name}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-emerald-300">Shift: {patient.caregiver_shift || "Morning"}</div>
                      </div>
                    </div>
                  ))}
                  {data.patients?.filter((patient) => patient.assigned_caregiver).length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-slate-300">No current assignments available.</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
