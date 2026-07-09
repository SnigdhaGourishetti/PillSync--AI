import { useEffect, useState } from "react";
import { FiBell, FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/accounts/profile/");
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#111827]/80 px-8 backdrop-blur-xl">

      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-white">
          Pill<span className="text-emerald-400">Sync</span>
        </h1>
      </div>

      {/* Search */}
      <div className="w-[420px] relative hidden md:block">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400" />

        <input
          type="text"
          placeholder="Search medicines, reminders..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-emerald-400 transition"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full border border-white/10 bg-slate-800 p-3 text-slate-300 transition hover:text-white">
          <FiBell size={18} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <Link to="/profile" className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-800/70 px-3 py-2 transition hover:bg-slate-700">
          <FaUserCircle size={34} className="text-emerald-400" />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white">{profile?.username || "User"}</p>
            <p className="text-xs text-slate-400">{profile?.role ? profile.role.toLowerCase() : "member"}</p>
          </div>
        </Link>

        <button onClick={handleLogout} className="rounded-xl bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-slate-700">
          Logout
        </button>
      </div>

    </header>
  );
}