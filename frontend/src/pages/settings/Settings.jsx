import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

export default function Settings() {
  const [preferences, setPreferences] = useState({
    pushReminders: true,
    emailSummaries: false,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pillsync-settings");
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem("pillsync-settings", JSON.stringify(preferences));
    setMessage("Preferences saved.");
  };

  const handleReset = () => {
    const defaults = {
      pushReminders: true,
      emailSummaries: false,
    };
    setPreferences(defaults);
    localStorage.setItem("pillsync-settings", JSON.stringify(defaults));
    setMessage("Preferences reset to default.");
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-slate-400">Customize how PillSync supports you.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-400">Save preferences</button>
          <button onClick={handleReset} className="rounded-xl border border-white/10 px-4 py-2 font-semibold text-slate-200 transition hover:bg-slate-800">Reset</button>
        </div>
      </div>

      {message ? <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div> : null}

      <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="mt-2 text-sm text-slate-400">Manage how reminders and updates are delivered.</p>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
            <span>Push reminders</span>
            <input type="checkbox" checked={preferences.pushReminders} onChange={() => handleToggle("pushReminders")} className="h-4 w-4" />
          </label>
          <label className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-4">
            <span>Email summaries</span>
            <input type="checkbox" checked={preferences.emailSummaries} onChange={() => handleToggle("emailSummaries")} className="h-4 w-4" />
          </label>
        </div>
      </div>
    </MainLayout>
  );
}
