import {
  FiGrid,
  FiPackage,
  FiClock,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const role = (localStorage.getItem("role") || "PATIENT").toUpperCase();
  const dashboardPath = role === "ADMIN" ? "/admin-dashboard" : role === "CAREGIVER" ? "/caregiver-dashboard" : "/dashboard";
  const isDashboardActive = ["/dashboard", "/admin-dashboard", "/caregiver-dashboard"].includes(location.pathname);

  const baseMenu = [
    {
      title: "Dashboard",
      path: dashboardPath,
      icon: <FiGrid />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <FiUser />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <FiSettings />,
    },
  ];

  const patientMenu = [
    ...baseMenu,
    {
      title: "Medicines",
      path: "/medicines",
      icon: <FiPackage />,
    },
    {
      title: "Reminders",
      path: "/reminders",
      icon: <FiClock />,
    },
    {
      title: "Prescriptions",
      path: "/prescriptions",
      icon: <FiFileText />,
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: <FiBarChart2 />,
    },
  ];

  const caregiverMenu = [
    ...baseMenu,
    {
      title: "Patients",
      path: "/caregiver-patients",
      icon: <FiUsers />,
    },
    {
      title: "Care Tasks",
      path: "/reminders",
      icon: <FiClock />,
    },
    {
      title: "Reports",
      path: "/analytics",
      icon: <FiBarChart2 />,
    },
  ];

  const adminMenu = [
    ...baseMenu,
    {
      title: "Manage People",
      path: "/admin-manage",
      icon: <FiUsers />,
    },
    {
      title: "Assignments",
      path: "/admin-dashboard",
      icon: <FiClock />,
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: <FiBarChart2 />,
    },
  ];

  const menu = role === "ADMIN" ? adminMenu : role === "CAREGIVER" ? caregiverMenu : patientMenu;

  return (
    <aside className="w-72 bg-[#111827] border-r border-white/10 min-h-screen">

      <div className="p-8 border-b border-white/10">
        <h2 className="text-3xl font-bold text-white">
          Pill<span className="text-emerald-400">Sync</span>
        </h2>

        <p className="text-slate-400 text-sm mt-2">
          Medication Management
        </p>
      </div>

      <nav className="p-5">

        {menu.map((item) => (

          <Link
            key={item.title}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl mb-3 transition-all duration-300
              ${
                (item.title === "Dashboard" && isDashboardActive) || location.pathname === item.path
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
          >

            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.title}
            </span>

          </Link>

        ))}

      </nav>

    </aside>
  );
}