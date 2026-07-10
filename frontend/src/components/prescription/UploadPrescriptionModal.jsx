import { useState } from "react";

export default function UploadPrescriptionModal({ onClose, onUpload }) {
  const [form, setForm] = useState({
    doctor_name: "",
    hospital_name: "",
    prescription_date: "",
    notes: "",
    prescription_image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("doctor_name", form.doctor_name);
    data.append("hospital_name", form.hospital_name);
    data.append("prescription_date", form.prescription_date);
    data.append("notes", form.notes);
    if (form.prescription_image) {
      data.append("prescription_image", form.prescription_image);
    }
    onUpload(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#111827] p-6 text-white">
        <h2 className="mb-6 text-2xl font-bold">Upload Prescription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="doctor_name" placeholder="Doctor Name" onChange={handleChange} required className="w-full rounded-xl bg-slate-800 p-3" />
          <input name="hospital_name" placeholder="Hospital Name" onChange={handleChange} required className="w-full rounded-xl bg-slate-800 p-3" />
          <input type="date" name="prescription_date" onChange={handleChange} required className="w-full rounded-xl bg-slate-800 p-3" />
          <textarea name="notes" placeholder="Notes" onChange={handleChange} className="w-full rounded-xl bg-slate-800 p-3" />
          <input type="file" name="prescription_image" accept="image/*" onChange={handleChange} required className="w-full rounded-xl bg-slate-800 p-3" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl bg-gray-600 px-4 py-2">Cancel</button>
            <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}
