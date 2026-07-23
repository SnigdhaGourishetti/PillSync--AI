import { useEffect, useState } from "react";
import { addMedicine, updateMedicine } from "../../services/medicineService";

const emptyForm = {
  medicine_name: "",
  dosage: "",
  medicine_type: "Tablet",
  frequency_per_day: "",
  schedule_type: "CUSTOM",
  stock_quantity: "",
  expiry_date: "",
  instructions: "",
};

export default function AddMedicineModal({ medicine, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (medicine) {
      setForm({
        medicine_name: medicine.medicine_name || "",
        dosage: medicine.dosage || "",
        medicine_type: medicine.medicine_type || "Tablet",
        frequency_per_day: medicine.frequency_per_day || "",
        schedule_type: medicine.schedule_type || "CUSTOM",
        stock_quantity: medicine.stock_quantity || "",
        expiry_date: medicine.expiry_date || "",
        instructions: medicine.instructions || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.medicine_name.trim()) nextErrors.medicine_name = "Medicine name is required";
    if (!form.dosage.trim()) nextErrors.dosage = "Dosage is required";
    if (!form.frequency_per_day || Number(form.frequency_per_day) < 1) nextErrors.frequency_per_day = "Frequency must be at least 1";
    if (!form.stock_quantity || Number(form.stock_quantity) < 0) nextErrors.stock_quantity = "Stock must be 0 or more";
    if (!form.expiry_date) nextErrors.expiry_date = "Expiry date is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        medicine_name: form.medicine_name,
        dosage: form.dosage,
        medicine_type: form.medicine_type,
        frequency_per_day: Number(form.frequency_per_day),
        schedule_type: form.schedule_type,
        stock_quantity: Number(form.stock_quantity),
        expiry_date: form.expiry_date,
        instructions: form.instructions,
      };

      if (medicine) {
        await updateMedicine(medicine.id, payload);
      } else {
        await addMedicine(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setErrors({ submit: err.response?.data?.detail || "Unable to save medicine." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-[#111827] p-8 text-white">
        <h2 className="mb-6 text-2xl font-bold">{medicine ? "Edit Medicine" : "Add Medicine"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input name="medicine_name" value={form.medicine_name} placeholder="Medicine Name" onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3" />
              {errors.medicine_name && <p className="mt-1 text-sm text-rose-400">{errors.medicine_name}</p>}
            </div>

            <div>
              <input name="dosage" value={form.dosage} placeholder="Dosage" onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3" />
              {errors.dosage && <p className="mt-1 text-sm text-rose-400">{errors.dosage}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select name="medicine_type" value={form.medicine_type} onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3">
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Drops">Drops</option>
              <option value="Ointment">Ointment</option>
              <option value="Other">Other</option>
            </select>

            <div>
              <input type="number" min="1" name="frequency_per_day" value={form.frequency_per_day} placeholder="Frequency" onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3" />
              {errors.frequency_per_day && <p className="mt-1 text-sm text-rose-400">{errors.frequency_per_day}</p>}
            </div>
          </div>

          <div>
            <select name="schedule_type" value={form.schedule_type} onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3">
              <option value="CUSTOM">Custom Time</option>
              <option value="MORNING">Morning</option>
              <option value="AFTERNOON">Afternoon</option>
              <option value="NIGHT">Night</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input type="number" min="0" name="stock_quantity" value={form.stock_quantity} placeholder="Stock" onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3" />
              {errors.stock_quantity && <p className="mt-1 text-sm text-rose-400">{errors.stock_quantity}</p>}
            </div>

            <div>
              <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3" />
              {errors.expiry_date && <p className="mt-1 text-sm text-rose-400">{errors.expiry_date}</p>}
            </div>
          </div>

          <textarea name="instructions" value={form.instructions} placeholder="Instructions" onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3" />

          {errors.submit && <p className="text-sm text-rose-400">{errors.submit}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl bg-gray-600 px-5 py-2 text-white">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-xl bg-emerald-500 px-5 py-2 text-white disabled:opacity-60">
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}