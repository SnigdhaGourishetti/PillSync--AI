import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { deleteMedicine, getMedicines } from "../../services/medicineService";
import AddMedicineModal from "../../components/medicine/AddMedicineModal";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (err) {
      setError("Unable to load medicines right now.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      await deleteMedicine(id);
      fetchMedicines();
    } catch (err) {
      setError("Unable to delete medicine.");
      console.error(err);
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.medicine_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || medicine.medicine_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Medicines</h1>
          <p className="mt-2 text-slate-400">Manage all your medicines.</p>
        </div>

        <button
          onClick={() => {
            setEditingMedicine(null);
            setShowModal(true);
          }}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white"
        >
          + Add Medicine
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medicines"
          className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white md:max-w-sm"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
        >
          <option value="All">All Types</option>
          <option value="Tablet">Tablet</option>
          <option value="Capsule">Capsule</option>
          <option value="Syrup">Syrup</option>
          <option value="Injection">Injection</option>
          <option value="Drops">Drops</option>
          <option value="Ointment">Ointment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">Loading medicines...</div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-950/40 p-8 text-rose-300">{error}</div>
      ) : filteredMedicines.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-[#111827] p-10 text-center text-slate-400">
          No medicines match your search yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827]">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-5 text-left text-slate-300">Medicine</th>
                <th className="p-5 text-left text-slate-300">Dosage</th>
                <th className="p-5 text-left text-slate-300">Type</th>
                <th className="p-5 text-left text-slate-300">Frequency</th>
                <th className="p-5 text-left text-slate-300">Stock</th>
                <th className="p-5 text-left text-slate-300">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id} className="border-t border-white/10">
                  <td className="p-5 text-white">{medicine.medicine_name}</td>
                  <td className="p-5 text-slate-300">{medicine.dosage}</td>
                  <td className="p-5 text-slate-300">{medicine.medicine_type}</td>
                  <td className="p-5 text-slate-300">{medicine.frequency_per_day}</td>
                  <td className="p-5 text-emerald-400">{medicine.stock_quantity}</td>
                  <td className="p-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMedicine(medicine);
                          setShowModal(true);
                        }}
                        className="rounded-xl bg-slate-700 px-3 py-2 text-sm text-white"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(medicine.id)} className="rounded-xl bg-rose-600 px-3 py-2 text-sm text-white">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddMedicineModal
          medicine={editingMedicine}
          onClose={() => {
            setShowModal(false);
            setEditingMedicine(null);
          }}
          onSuccess={fetchMedicines}
        />
      )}
    </MainLayout>
  );
}