import { useEffect, useState } from "react";

export default function ReminderModal({ reminder, medicines, onClose, onSave }) {
  const [form, setForm] = useState({
    medicine: "",
    reminder_time: "",
    repeat_type: "DAILY",
    is_active: true,
  });

  useEffect(() => {
    if (reminder) {
      setForm({
        medicine: reminder.medicine,
        reminder_time: reminder.reminder_time,
        repeat_type: reminder.repeat_type,
        is_active: reminder.is_active,
      });
    }
  }, [reminder]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-[#111827] p-6 text-white">
        <h2 className="mb-6 text-2xl font-bold">{reminder ? "Edit Reminder" : "Add Reminder"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="medicine"
            value={form.medicine}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-800 p-3"
          >
            <option value="">Select medicine</option>
            {medicines.map((medicine) => (
              <option key={medicine.id} value={medicine.id}>
                {medicine.medicine_name}
              </option>
            ))}
          </select>

          <input
            type="time"
            name="reminder_time"
            value={form.reminder_time}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-800 p-3"
          />

          <select
            name="repeat_type"
            value={form.repeat_type}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-800 p-3"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl bg-gray-600 px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
