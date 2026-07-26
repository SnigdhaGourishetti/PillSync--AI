import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getMedicines } from "../../services/medicineService";
import {
  addReminder,
  deleteReminder,
  getReminders,
  updateReminder,
  actionReminder,
} from "../../services/reminderService";
import ReminderModal from "../../components/reminder/ReminderModal";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [reminderData, medicineData] = await Promise.all([
        getReminders(),
        getMedicines(),
      ]);

      setReminders(reminderData);
      setMedicines(medicineData);
    } catch (err) {
      setError("Failed to load reminders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, form);
        setSuccessMessage("Reminder updated successfully!");
      } else {
        await addReminder(form);
        setSuccessMessage("Reminder added successfully!");
      }

      setShowModal(false);
      setEditingReminder(null);
      loadData();
    } catch (err) {
      setError("Failed to save reminder. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?"))
      return;

    try {
      await deleteReminder(id);
      setSuccessMessage("Reminder deleted successfully!");
      loadData();
    } catch (err) {
      setError("Failed to delete reminder. Please try again.");
      console.error(err);
    }
  };

  // ✅ FIXED FUNCTION
  const handleStatusChange = async (id, newStatus) => {
    try {
      await actionReminder(id, newStatus);

      setSuccessMessage(`Reminder marked as ${newStatus}!`);

      loadData();
    } catch (err) {
      console.error(err.response?.data || err);

      setError(
        err.response?.data?.detail ||
          "Failed to update reminder status. Please try again."
      );
    }
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Reminders</h1>
          <p className="mt-2 text-slate-400">
            Manage reminders for each medicine.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingReminder(null);
            setShowModal(true);
          }}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white"
        >
          + Add Reminder
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/50 bg-rose-500/20 p-4 text-rose-400">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl border border-emerald-500/50 bg-emerald-500/20 p-4 text-emerald-400">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-[#111827] p-8 text-slate-300">
          Loading reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-[#111827] p-10 text-center text-slate-400">
          No reminders yet. Create your first one.
        </div>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="rounded-3xl border border-white/10 bg-[#111827] p-5 text-white"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {reminder.medicine_name || reminder.medicine}
                  </p>

                  <p className="text-sm text-slate-400">
                    Time: {reminder.reminder_time} • {reminder.repeat_type}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        reminder.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : reminder.status === "TAKEN"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : reminder.status === "MISSED"
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {reminder.status}
                    </span>

                    {reminder.notes && (
                      <p className="text-xs text-slate-400">
                        {reminder.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {reminder.status === "PENDING" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(reminder.id, "TAKEN")
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
                      >
                        Taken
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(reminder.id, "MISSED")
                        }
                        className="rounded-xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-500"
                      >
                        Missed
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(reminder.id, "SNOOZED")
                        }
                        className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                      >
                        Snoozed
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setEditingReminder(reminder);
                      setShowModal(true);
                    }}
                    className="rounded-xl bg-slate-700 px-4 py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="rounded-xl bg-rose-600 px-4 py-2"
                  >
                    Delete
                  </button>
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
          onClose={() => {
            setShowModal(false);
            setEditingReminder(null);
          }}
          onSave={handleSave}
        />
      )}
    </MainLayout>
  );
}