import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm h-[94px] px-6">
      <div className="flex items-center justify-center w-[239px] h-[94px]">
        <img
          src="/Group 3.png"
          alt="Logo"
          className="w-[139px] h-[54px] object-contain"
        />
      </div>

      <div className="w-[1203px] h-[94px] flex items-center justify-between">
        <div className="relative w-[214px] h-[36px]">
          <input
            type="text"
            placeholder="Qidiruv tizimi..."
            className="w-full h-full pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex items-center" style={{ gap: "10px" }}>
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <img
              src="/Frame 24.png"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/Frame 16.png"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-800">Ruslan Mirzaev</p>
              <p className="text-xs text-gray-500">Foydalanuvchi</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
