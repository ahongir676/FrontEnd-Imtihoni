import { useNavigate } from "react-router-dom";
import { useState } from "react";

const featureFlags = {
  enableCalendar: true,
  enableImageUpload: true,
  showSalaryField: true,
  enablePhoneValidation: true,
  enableGenderColors: true,
  enableAdvancedEducationFields: false,
};

const AddTeacher = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("O'g'il bola");
  const [inputValue, setInputValue] = useState("+998 ");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    address: "",
  });

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(3);
    const parts = [];
    if (raw.length >= 2) {
      parts.push(`(${raw.slice(0, 2)})`);
    } else if (raw.length > 0) {
      parts.push(`(${raw}`);
    }
    if (raw.length >= 5) {
      parts.push(` ${raw.slice(2, 5)}`);
    } else if (raw.length > 2) {
      parts.push(` ${raw.slice(2)}`);
    }
    if (raw.length >= 7) {
      parts.push(`-${raw.slice(5, 7)}`);
    } else if (raw.length > 5) {
      parts.push(`-${raw.slice(5)}`);
    }
    if (raw.length >= 9) {
      parts.push(`-${raw.slice(7, 9)}`);
    } else if (raw.length > 7) {
      parts.push(`-${raw.slice(7)}`);
    }
    return "+998 " + parts.join("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue.startsWith("+998")) return;
    setInputValue(formatPhone(newValue));
  };

  const handleBlur = () => {
    if (featureFlags.enablePhoneValidation) {
      const raw = inputValue.replace(/\D/g, "").slice(3);
      if (raw.length !== 9) {
        console.log("Noto'liq raqam");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSelectClass = () => {
    if (!featureFlags.enableGenderColors) return "text-gray-700";

    if (gender === "O'g'il bola") return "text-green-600";
    if (gender === "Qiz bola") return "text-pink-500";
    return "text-gray-700";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-[#1E293B]">
          O'qituvchilarni qo'shish
        </h1>
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

      <div className="grid grid-cols-4 gap-4 items-start">
        {featureFlags.enableImageUpload && (
          <div className="w-[199px] h-[182px] flex flex-col">
            <span className="text-sm font-semibold text-gray-700 self-start mb-1">
              Rasm
            </span>
            <label
              htmlFor="photoUpload"
              className="cursor-pointer flex flex-col items-center justify-center flex-1 border border-gray-200 rounded-md"
            >
              <img
                src="/Vector1.png"
                alt="Upload"
                className="w-[60px] h-[60px] object-cover"
              />
              <p className="text-sm text-gray-500 mt-1">Rasmni kiriting</p>
            </label>
            <input id="photoUpload" type="file" className="hidden" />
          </div>
        )}

        <div
          className={`${
            featureFlags.enableImageUpload ? "col-span-3" : "col-span-4"
          } grid grid-cols-3 gap-4`}
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Ism</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Shokirjon"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Familiya
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
              placeholder="Sultonov"
            />
          </div>
          <div className="flex flex-col ">
            <label className="text-sm font-medium text-gray-700">Sharfi</label>
            <input
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              className="  w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
              placeholder="Tursinjon o'g'li"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tug'ilgan sana
            </label>
            <div className="relative w-[199px]">
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="border border-gray-300 w-full h-[35px] pl-3 pr-10 text-sm outline-none rounded-none shadow-sm focus:shadow-md appearance-none"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              />
              <img
                src="/calendar.png"
                alt="calendar"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Jinsi</label>
            <select
              className={`w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md border border-gray-300 ${getSelectClass()}`}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="O'g'il bola">O'g'il bola</option>
              <option value="Qiz bola">Qiz bola</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Yashash manzili
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
            />
          </div>
        </div>

        <div className="col-span-4 grid grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tel raqami
            </label>
            <input
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
              placeholder="+998 (__) ___-__-__"
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Mutaxassisligi
            </label>
            <select
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
              name="specialization"
              onChange={handleInputChange}
            >
              <option>Fan yoki kurs</option>
              <option>1 yil</option>
              <option>2 yil</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tajribasi
            </label>
            <select
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
              name="experience"
              onChange={handleInputChange}
            >
              <option>1 yil</option>
              <option>2 yil</option>
              <option>3 yil</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Malumoti
            </label>
            <select
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
              name="educationLevel"
              onChange={handleInputChange}
            >
              <option>O'rta</option>
              <option>Oliy</option>
            </select>
          </div>

          {featureFlags.enableAdvancedEducationFields && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Ta'lim muassasasi
              </label>
              <input className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md" />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Maosh turi
            </label>
            <select
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
              name="employmentType"
              onChange={handleInputChange}
            >
              <option>Soatbay</option>
              <option>Haftalik</option>
              <option>Oylik</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Maosh sanasi
            </label>
            <input
              type="date"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
            />
          </div>

          {featureFlags.showSalaryField && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Maoshi
              </label>
              <input
                name="salary"
                onChange={handleInputChange}
                className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded-none shadow-sm focus:shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
