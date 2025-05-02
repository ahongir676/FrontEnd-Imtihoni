import { useNavigate } from "react-router-dom";

const AddGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-[#1E293B]">Guruh yaratish</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 h-[36px] border border-red-400 text-red-500 rounded-md text-sm font-medium shadow-sm hover:bg-red-50"
          >
            <img src="/Vector.png" alt="cancel" className="w-4 h-4" />
            Bekor qilish
          </button>
          <button
            className="flex items-center gap-2 px-4 h-[36px] bg-white text-[#3AADA8] border border-[#3AADA8] rounded-md text-sm font-medium shadow-sm hover:bg-gray-50"
            onClick={() => navigate(-1)}
          >
            <img src="/Clipboard Check.png" alt="save" className="w-4 h-4" />
            Saqlash
          </button>
        </div>
      </div>

      <div className="border-t-[1px] border-black my-[21px]"></div>

      <div className="grid grid-cols-4 gap-4 items-start">
        <div className="col-span-3 grid grid-cols-3 gap-2.5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nomi</label>
            <select className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md">
              <option>Yulduzcha</option>
              <option>Quyoshcha</option>
              <option>Oycha</option>
              <option>Baxorcha</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Boshlangan Sana
            </label>
            <input
              type="date"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Daraja</label>
            <input
              type="text"
              placeholder="1-sinf"
              className=" border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGroup;
