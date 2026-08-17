import { FiBell, FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <header className="h-20 bg-[#111827]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8">

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
      <div className="flex items-center gap-6">

        <button className="relative">
          <FiBell
            size={22}
            className="text-slate-300 hover:text-white transition"
          />

          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={40}
            className="text-emerald-400"
          />

          <div className="hidden md:block">
            <p className="font-semibold text-white">
              Snigdha
            </p>

            <p className="text-sm text-slate-400">
              Welcome Back
            </p>
          </div>

          <button onClick={handleLogout} className="rounded-xl bg-slate-800 px-3 py-2 text-sm text-white">
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}