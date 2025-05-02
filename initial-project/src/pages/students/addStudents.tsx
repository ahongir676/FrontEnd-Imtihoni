import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AddStudent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    gender: "",
    address: "",
    group: "",
    paymentMethod: "",
    paymentAmount: "",
    parentPhone: "+998 ",
    username: "",
    password: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName) newErrors.firstName = "Ism kiritilishi kerak";
    if (!form.lastName) newErrors.lastName = "Familiya kiritilishi kerak";
    if (!form.middleName) newErrors.middleName = "Sharif kiritilishi kerak";
    if (!form.birthDate) newErrors.birthDate = "Tug‘ilgan sana kerak";
    if (!form.gender) newErrors.gender = "Jins tanlanishi kerak";
    if (!form.address) newErrors.address = "Manzil kiritilishi kerak";
    if (!form.group) newErrors.group = "Guruh tanlanishi kerak";
    if (!form.paymentMethod)
      newErrors.paymentMethod = "To‘lov usuli tanlanishi kerak";
    if (!form.paymentAmount) newErrors.paymentAmount = "To‘lov summasi kerak";
    const rawPhone = form.parentPhone.replace(/\D/g, "").slice(3);
    if (!form.username) newErrors.username = "Username kiritilishi kerak";
    if (!form.password) newErrors.password = "Parol kiritilishi kerak";
    if (rawPhone.length !== 9) newErrors.parentPhone = "To‘liq raqam kiriting";
    return newErrors;
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(3);
    const parts = [];

    if (raw.length >= 2) parts.push(`(${raw.slice(0, 2)})`);
    else if (raw.length > 0) parts.push(`(${raw}`);

    if (raw.length >= 5) parts.push(` ${raw.slice(2, 5)}`);
    else if (raw.length > 2) parts.push(` ${raw.slice(2)}`);

    if (raw.length >= 7) parts.push(`-${raw.slice(5, 7)}`);
    else if (raw.length > 5) parts.push(`-${raw.slice(5)}`);

    if (raw.length >= 9) parts.push(`-${raw.slice(7, 9)}`);
    else if (raw.length > 7) parts.push(`-${raw.slice(7)}`);

    return "+998 " + parts.join("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue.startsWith("+998")) return;
    handleChange("parentPhone", formatPhone(newValue));
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Iltimos, barcha maydonlarni to‘ldiring");
      return;
    }

    try {
      const storedData = localStorage.getItem("auth");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const token = parsedData?.state.token;

      const formData = new FormData();
      formData.append("full_name", form.firstName + form.lastName);
      formData.append("username", form.username);
      formData.append("password", form.password);
      formData.append("birth_date", form.birthDate);
      formData.append("gender", form.gender);
      formData.append("address", form.address);
      formData.append("group_id", String(form.group));
      formData.append("payment_method", form.paymentMethod);
      if (isNaN(Number(form.paymentAmount))) {
        newErrors.paymentAmount = "To‘lov summasi raqam bo‘lishi kerak";
      }
      formData.append("payment_amount", String(Number(form.paymentAmount)));
      formData.append("parent_phone", form.parentPhone);
      if (photo) {
        formData.append("photo", photo);
      }

      const res = await fetch(
        "https://api.admin.bekzodjon.uz/api/v1/students",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        toast.success("O‘quvchi muvaffaqiyatli qo‘shildi");
        navigate(-1);
      } else {
        toast.error("Xatolik yuz berdi. Qayta urinib ko‘ring");
      }
    } catch (error) {
      toast.error("Server bilan bog‘lanishda xatolik");
    }
  };

  const getSelectClass = () => {
    if (form.gender === "O‘g‘il bola") return "text-green-600";
    if (form.gender === "Qiz bola") return "text-pink-500";
    return "text-gray-700";
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const storedData = localStorage.getItem("auth");
        const parsedData = storedData ? JSON.parse(storedData) : null;
        const token = parsedData?.state.token;

        const response = await axios.get(
          "https://api.admin.bekzodjon.uz/api/v1/groups",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedGroups = response.data.data.map((group: any) => ({
          id: group.id,
          name: group.name,
        }));

        setGroups(formattedGroups);
      } catch (error) {
        toast.error("Guruhlarni olib kelishda xatolik yuz berdi");
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-[#1E293B]">
          O‘quvchilarni qo‘shish
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
            onClick={handleSubmit}
          >
            <img src="/Clipboard Check.png" alt="save" className="w-4 h-4" />
            Saqlash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-start">
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
          <input
            id="photoUpload"
            type="file"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-4">
          {[
            { label: "Ism", key: "firstName", placeholder: "Ismingiz" },
            { label: "Familiya", key: "lastName", placeholder: "Familiya" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                value={form[key as keyof typeof form]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
              />
              {errors[key] && (
                <span className="text-xs text-red-500">{errors[key]}</span>
              )}
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="foydalanuvchi nomi"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            />
            {errors.username && (
              <span className="text-xs text-red-500">{errors.username}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Parol</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Parol kiriting"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            />
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tug‘ilgan sana
            </label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            />
            {errors.birthDate && (
              <span className="text-xs text-red-500">{errors.birthDate}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Jinsi</label>
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className={`border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md ${getSelectClass()}`}
            >
              <option value="">Tanlang</option>
              <option value="O‘g‘il bola">O‘g‘il bola</option>
              <option value="Qiz bola">Qiz bola</option>
            </select>
            {errors.gender && (
              <span className="text-xs text-red-500">{errors.gender}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Yashash manzili
            </label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Yashash manzili"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            />
            {errors.address && (
              <span className="text-xs text-red-500">{errors.address}</span>
            )}
          </div>
        </div>

        <div className="col-span-4 grid grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Guruh nomi
            </label>
            <select
              value={form.group}
              onChange={(e) => handleChange("group", e.target.value)}
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            >
              <option value="">Tanlang</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.group && (
              <span className="text-xs text-red-500">{errors.group}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              To‘lov usuli
            </label>
            <select
              value={form.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            >
              <option value="">Tanlang</option>
              <option value="Naqd">Naqd</option>
              <option value="Karta">Karta</option>
            </select>
            {errors.paymentMethod && (
              <span className="text-xs text-red-500">
                {errors.paymentMethod}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              To‘lov summasi
            </label>
            <input
              value={form.paymentAmount}
              onChange={(e) => handleChange("paymentAmount", e.target.value)}
              placeholder="500 000 so‘m"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            />
            {errors.paymentAmount && (
              <span className="text-xs text-red-500">
                {errors.paymentAmount}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ota-onasi tel raqami
            </label>
            <input
              value={form.parentPhone}
              onChange={handlePhoneChange}
              placeholder="+998 (__) ___-__-__"
              className="border border-gray-300 w-[199px] h-[35px] px-3 text-sm outline-none rounded shadow-sm focus:shadow-md"
            />
            {errors.parentPhone && (
              <span className="text-xs text-red-500">{errors.parentPhone}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
