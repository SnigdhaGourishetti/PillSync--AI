import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

const initialForm = {
  username: "",
  email: "",
  phone: "",
  blood_group: "",
  emergency_contact: "",
  allergies: "",
  date_of_birth: "",
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/accounts/profile/");
        setProfile(response.data);
        setForm({
          username: response.data.username || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          blood_group: response.data.blood_group || "",
          emergency_contact: response.data.emergency_contact || "",
          allergies: response.data.allergies || "",
          date_of_birth: response.data.date_of_birth || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await api.patch("/accounts/profile/", form);
      setProfile(response.data);
      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("We could not update your profile right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <p className="mt-2 text-slate-400">Keep your medical information up to date.</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-400">
            Edit profile
          </button>
        ) : null}
      </div>

      {message ? <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div> : null}

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">Loading profile...</div>
      ) : profile ? (
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 text-white shadow-2xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-2xl font-bold text-emerald-400">
              {profile.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile.username}</h2>
              <p className="text-slate-400">{profile.role}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <p className="text-sm text-slate-400">Email</p>
              {isEditing ? (
                <input name="email" value={form.email} onChange={handleChange} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none" />
              ) : (
                <p className="mt-1 font-medium">{profile.email || "Not provided"}</p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <p className="text-sm text-slate-400">Phone</p>
              {isEditing ? (
                <input name="phone" value={form.phone} onChange={handleChange} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none" />
              ) : (
                <p className="mt-1 font-medium">{profile.phone || "Not provided"}</p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <p className="text-sm text-slate-400">Blood group</p>
              {isEditing ? (
                <input name="blood_group" value={form.blood_group} onChange={handleChange} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none" />
              ) : (
                <p className="mt-1 font-medium">{profile.blood_group || "Not provided"}</p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <p className="text-sm text-slate-400">Emergency contact</p>
              {isEditing ? (
                <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none" />
              ) : (
                <p className="mt-1 font-medium">{profile.emergency_contact || "Not provided"}</p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-800/70 p-4 md:col-span-2">
              <p className="text-sm text-slate-400">Allergies</p>
              {isEditing ? (
                <textarea name="allergies" value={form.allergies} onChange={handleChange} rows="3" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none" />
              ) : (
                <p className="mt-1 font-medium">{profile.allergies || "No known allergies"}</p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <p className="text-sm text-slate-400">Date of birth</p>
              {isEditing ? (
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none" />
              ) : (
                <p className="mt-1 font-medium">{profile.date_of_birth || "Not provided"}</p>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60">
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button onClick={() => { setIsEditing(false); setForm({ username: profile.username || "", email: profile.email || "", phone: profile.phone || "", blood_group: profile.blood_group || "", emergency_contact: profile.emergency_contact || "", allergies: profile.allergies || "", date_of_birth: profile.date_of_birth || "" }); }} className="rounded-xl border border-white/10 px-4 py-2 font-semibold text-slate-200 transition hover:bg-slate-800">
                Cancel
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">No profile data available.</div>
      )}
    </MainLayout>
  );
}
