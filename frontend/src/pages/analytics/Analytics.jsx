import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import { getMedicines } from "../../services/medicineService";
import { getReminders } from "../../services/reminderService";
import { getPrescriptions } from "../../services/prescriptionService";

export default function Analytics() {
  const role = (localStorage.getItem("role") || "PATIENT").toUpperCase();
  const [stats, setStats] = useState({ medicines: 0, reminders: 0, prescriptions: 0, lowStock: 0, caregivers: 0, patients: 0, assignedPatients: 0, shift: "Morning" });
  const [loading, setLoading] = useState(true);
  const [assignedPatients, setAssignedPatients] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (role === "ADMIN" || role === "CAREGIVER") {
          const response = await api.get("/accounts/assignments/");
          const assignmentData = response.data;
          setAssignedPatients(assignmentData.patients || []);

          if (role === "ADMIN") {
            const assignedCount = assignmentData.patients.filter((patient) => patient.assigned_caregiver).length;
            setStats({
              medicines: 0,
              reminders: 0,
              prescriptions: 0,
              lowStock: 0,
              caregivers: assignmentData.caregivers.length,
              patients: assignmentData.patients.length,
              assignedPatients: assignedCount,
              shift: "Morning",
            });
          } else {
            setStats({
              medicines: 0,
              reminders: 0,
              prescriptions: 0,
              lowStock: 0,
              caregivers: 0,
              patients: 0,
              assignedPatients: assignmentData.patients.length,
              shift: assignmentData.caregiver?.caregiver_shift || "Morning",
            });
          }
        } else {
          const [medicines, reminders, prescriptions] = await Promise.all([getMedicines(), getReminders(), getPrescriptions()]);
          const lowStock = medicines.filter((m) => Number(m.stock_quantity) <= 5).length;
          setStats({ medicines: medicines.length, reminders: reminders.length, prescriptions: prescriptions.length, lowStock, caregivers: 0, patients: 0, assignedPatients: 0, shift: "Morning" });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const pageTitle = role === "ADMIN" ? "Assignment Analytics" : role === "CAREGIVER" ? "Caregiver Analytics" : "Analytics";
  const description =
    role === "ADMIN"
      ? "Track caregiver coverage, patient assignment status, and shift capacity."
      : role === "CAREGIVER"
      ? "See your patient load, shift plan, and care priorities for today."
      : "A quick overview of your medication routine.";

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">{pageTitle}</h1>
        <p className="mt-2 text-slate-400">{description}</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">Loading analytics...</div>
      ) : role === "ADMIN" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-emerald-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-emerald-400">Total Caregivers</p>
            <p className="mt-3 text-4xl font-bold">{stats.caregivers}</p>
          </div>
          <div className="rounded-3xl border border-cyan-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-cyan-400">Total Patients</p>
            <p className="mt-3 text-4xl font-bold">{stats.patients}</p>
          </div>
          <div className="rounded-3xl border border-violet-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-violet-400">Assigned Patients</p>
            <p className="mt-3 text-4xl font-bold">{stats.assignedPatients}</p>
          </div>

          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
            <h2 className="text-xl font-semibold">Assignment summary</h2>
            <div className="mt-4 space-y-3 text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
                <span>Assigned patients</span>
                <span className="font-semibold text-emerald-400">{stats.assignedPatients}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
                <span>Caregiver capacity</span>
                <span className="font-semibold text-cyan-400">{stats.caregivers} caregivers</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
                <span>Avg. patients per caregiver</span>
                <span className="font-semibold text-violet-400">{stats.caregivers ? Math.ceil(stats.assignedPatients / stats.caregivers) : 0}</span>
              </div>
            </div>
          </div>
        </div>
      ) : role === "CAREGIVER" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-emerald-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-emerald-400">Assigned patients</p>
            <p className="mt-3 text-4xl font-bold">{stats.assignedPatients}</p>
          </div>
          <div className="rounded-3xl border border-cyan-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-cyan-400">Shift</p>
            <p className="mt-3 text-4xl font-bold">{stats.shift}</p>
          </div>
          <div className="rounded-3xl border border-violet-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-violet-400">Active tasks</p>
            <p className="mt-3 text-4xl font-bold">{stats.assignedPatients}</p>
          </div>

          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
            <h2 className="text-xl font-semibold">Care focus</h2>
            <div className="mt-4 space-y-3 text-slate-300">
              <div className="rounded-2xl bg-slate-800/70 p-4">
                <p>Track medication adherence, confirm dosages, and update patient notes after each visit.</p>
              </div>
              <div className="rounded-2xl bg-slate-800/70 p-4">
                <p className="font-semibold">Today’s patients</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {assignedPatients.map((patient) => (
                    <li key={patient.id}>{patient.username} — {patient.caregiver_shift || stats.shift}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-emerald-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-emerald-400">Total Medicines</p>
            <p className="mt-3 text-4xl font-bold">{stats.medicines}</p>
          </div>
          <div className="rounded-3xl border border-amber-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-amber-400">Active Reminders</p>
            <p className="mt-3 text-4xl font-bold">{stats.reminders}</p>
          </div>
          <div className="rounded-3xl border border-cyan-500/20 bg-[#111827] p-6 text-white">
            <p className="text-sm text-cyan-400">Prescriptions</p>
            <p className="mt-3 text-4xl font-bold">{stats.prescriptions}</p>
          </div>

          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
            <h2 className="text-xl font-semibold">Health Summary</h2>
            <div className="mt-4 space-y-3 text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
                <span>Low stock medicines</span>
                <span className="font-semibold text-rose-400">{stats.lowStock}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
                <span>Medication coverage</span>
                <span className="font-semibold text-emerald-400">Healthy</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
                <span>Document records</span>
                <span className="font-semibold text-cyan-400">{stats.prescriptions} files</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
