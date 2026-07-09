import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

export default function CaregiverPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/accounts/assignments/");
        setPatients(response.data.patients || []);
      } catch (err) {
        setError("Unable to load assigned patients.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Caregiver patients</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Your patient roster</h1>
          <p className="mt-3 max-w-2xl text-slate-400">View the patients assigned to your shift and their care details.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 text-slate-300">Loading patients...</div>
        ) : error ? (
          <div className="rounded-3xl border border-white/10 bg-rose-950/40 p-8 text-rose-300">{error}</div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
            <div className="grid gap-4">
              {patients.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-slate-300">No patients are currently assigned to you.</div>
              ) : (
                patients.map((patient) => (
                  <div key={patient.id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{patient.username}</p>
                        <p className="text-sm text-slate-400">Email: {patient.email}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-emerald-300">Shift: {patient.caregiver_shift || "Morning"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
