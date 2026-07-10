import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

export default function AdminManage() {
  const [data, setData] = useState({ caregivers: [], patients: [] });
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [caregiverId, setCaregiverId] = useState("");
  const [shift, setShift] = useState("Morning");
  const [message, setMessage] = useState("");

  const unassignedPatients = data.patients.filter((patient) => !patient.assigned_caregiver);
  const caregiverOptions = data.caregivers.map((caregiver) => ({
    ...caregiver,
    full: caregiver.assigned_patients >= 3,
  }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/accounts/assignments/");
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/accounts/assignments/", {
        patient_id: patientId,
        caregiver_id: caregiverId,
        caregiver_shift: shift,
      });
      setMessage(response.data.detail);
      const refreshed = await api.get("/accounts/assignments/");
      setData(refreshed.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Assignment failed.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Admin people management</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Manage patients and caregiver assignments.</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Assign caregivers, track shift coverage, and review patient assignment status.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 text-slate-300">Loading people data...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
              <h2 className="text-xl font-semibold text-white">Assign caregiver</h2>
              <form onSubmit={handleAssign} className="mt-5 space-y-4">
                <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white" required>
                  <option value="">{unassignedPatients.length ? "Choose unassigned patient" : "No unassigned patients available"}</option>
                  {unassignedPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>{patient.username}</option>
                  ))}
                </select>
                <select value={caregiverId} onChange={(e) => setCaregiverId(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white" required>
                  <option value="">Choose caregiver</option>
                  {caregiverOptions.map((caregiver) => (
                    <option key={caregiver.id} value={caregiver.id} disabled={caregiver.full}>
                      {caregiver.username} {caregiver.full ? `(full ${caregiver.assigned_patients}/3)` : `(${caregiver.assigned_patients}/3)`}
                    </option>
                  ))}
                </select>
                <select value={shift} onChange={(e) => setShift(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white">
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white" disabled={!unassignedPatients.length || !caregiverId}>
                  Assign caregiver
                </button>
                {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
              <h2 className="text-xl font-semibold text-white">People overview</h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Caregivers</p>
                  <p className="mt-2 text-2xl font-bold text-cyan-400">{data.caregivers.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Patients</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">{data.patients.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Assigned patients</p>
                  <p className="mt-2 text-2xl font-bold text-violet-400">{data.patients.filter((patient) => patient.assigned_caregiver).length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
