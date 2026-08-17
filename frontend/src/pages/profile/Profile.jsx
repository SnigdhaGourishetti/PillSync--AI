import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/accounts/profile/");
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Profile</h1>
        <p className="mt-2 text-slate-400">Manage your account details.</p>
      </div>

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
              <p className="mt-1 font-medium">{profile.email || "Not provided"}</p>
            </div>
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <p className="text-sm text-slate-400">Phone</p>
              <p className="mt-1 font-medium">{profile.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">No profile data available.</div>
      )}
    </MainLayout>
  );
}
