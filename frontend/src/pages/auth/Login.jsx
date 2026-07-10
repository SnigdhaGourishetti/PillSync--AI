import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(username, password);
      const role = (data?.user?.role || data?.role || "PATIENT").toUpperCase();

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", role);

      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (role === "CAREGIVER") {
        navigate("/caregiver-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl"
      >
        <h1 className="mb-6 text-3xl font-bold">Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-xl border border-white/10 bg-slate-800 p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-xl border border-white/10 bg-slate-800 p-3"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}