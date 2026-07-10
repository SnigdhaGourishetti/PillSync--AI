import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getMedicines } from "../../services/medicineService";
import { addReminder, deleteReminder, getReminders, updateReminder } from "../../services/reminderService";
import ReminderModal from "../../components/reminder/ReminderModal";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reminderData, medicineData] = await Promise.all([getReminders(), getMedicines()]);
      setReminders(reminderData);
      setMedicines(medicineData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, form);
      } else {
        await addReminder(form);
      }
      setShowModal(false);
      setEditingReminder(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Reminders</h1>
          <p className="mt-2 text-slate-400">Manage reminders for each medicine.</p>
        </div>
        <button onClick={() => { setEditingReminder(null); setShowModal(true); }} className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white">
          + Add Reminder
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">Loading reminders...</div>
      ) : reminders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-[#111827] p-10 text-center text-slate-400">
          No reminders yet. Create your first one.
        </div>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="rounded-3xl border border-white/10 bg-[#111827] p-5 text-white">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold">{reminder.medicine_name || reminder.medicine}</p>
                  <p className="text-sm text-slate-400">Time: {reminder.reminder_time} • {reminder.repeat_type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingReminder(reminder); setShowModal(true); }} className="rounded-xl bg-slate-700 px-4 py-2">Edit</button>
                  <button onClick={() => handleDelete(reminder.id)} className="rounded-xl bg-rose-600 px-4 py-2">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ReminderModal
          reminder={editingReminder}
          medicines={medicines}
          onClose={() => { setShowModal(false); setEditingReminder(null); }}
          onSave={handleSave}
        />
      )}
    </MainLayout>
  );
}
