export default function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-lg hover:border-emerald-500 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-slate-400">{title}</p>

          <h2 className="text-4xl font-bold text-white mt-4">
            {value}
          </h2>
        </div>

        <div className={`text-5xl ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}