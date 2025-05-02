import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const links = [
    { to: "/", icon: "Widget 5.png", label: "Asosiy" },
    { to: "/students", icon: "Users Group Rounded.png", label: "O'quvchilar" },
    { to: "/teachers", icon: "people.png", label: "O'qituvchilar" },
    { to: "/groups", icon: "data-2.png", label: "Guruhlar" },
  ];
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="fixed top-[94px] left-0 w-[239px] h-[calc(100vh-94px)] bg-white text-[#1E1E2F] flex flex-col justify-between z-40">
      <div>
        <nav className="mt-[51px] flex flex-col gap-1">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 h-[44px] px-6 text-sm font-medium transition-all duration-200 rounded-r-lg ${
                  isActive
                    ? "bg-[#E6ECED] border-l-4 border-[#557C83] text-[#557C83]"
                    : "hover:bg-gray-100 text-gray-600"
                }`
              }
            >
              <img
                src={`/${link.icon}`}
                alt={link.label}
                className="w-5 h-5 object-contain"
              />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-6 mb-6">
        <button className="flex items-center gap-3 h-[44px] w-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200 rounded-r-lg px-2">
          <img src="/Settings.png" alt="Sozlamalar" className="w-5 h-5" />
          <span>Sozlamalar</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 h-[44px] w-full text-sm font-medium text-red-500 hover:bg-gray-100 transition-all duration-200 rounded-r-lg px-2"
        >
          <img src="/Login.png" alt="Chiqish" className="w-5 h-5" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
