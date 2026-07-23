import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getMedicationHistory } from "../../services/medicationHistoryService";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function MedicationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadHistory();
  }, [statusFilter]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter) {
        params.status = statusFilter;
      }
      const data = await getMedicationHistory(params);
      setHistory(data);
    } catch (err) {
      setError("Failed to load medication history. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (searchTerm && !item.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "TAKEN":
        return "bg-emerald-500/20 text-emerald-400";
      case "MISSED":
        return "bg-rose-500/20 text-rose-400";
      case "SNOOZED":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Medication History</h1>
          <p className="mt-2 text-slate-400">Track your medication adherence over time.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-500/20 border border-rose-500/50 p-4 text-rose-400">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by medicine name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#111827] py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#111827] py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="TAKEN">Taken</option>
            <option value="MISSED">Missed</option>
            <option value="SNOOZED">Snoozed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">Loading medication history...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-[#111827] p-10 text-center text-slate-400">
          No medication history found.
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#111827] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Medicine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Dosage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-slate-800/30">
                    <td className="px-6 py-4 text-white">{item.medicine_name || item.medicine}</td>
                    <td className="px-6 py-4 text-slate-400">{item.medicine_dosage || item.dosage}</td>
                    <td className="px-6 py-4 text-slate-400">{item.date}</td>
                    <td className="px-6 py-4 text-slate-400">{item.time}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
