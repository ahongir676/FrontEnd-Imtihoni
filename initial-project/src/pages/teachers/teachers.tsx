import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

type Group = {
  group_id: string;
  name: string;
  description: string;
};

type Image = {
  image_id: string;
  url: string;
  is_worked: boolean;
  user_id: string;
};

type Teacher = {
  id: string;
  full_name: string;
  firstname: string;
  lastName: string;
  username: string;
  dob?: string;
  gender: string;
  contact: Contact;
  group_members: Group[];
  images: Image[];
};

type Contact = {
  phone: string;
  email?: string;
};

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const storedData = localStorage.getItem("auth");
        const parsedData = storedData ? JSON.parse(storedData) : null;
        const token = parsedData?.state.token;

        const response = await axios.get(
          "https://api.admin.bekzodjon.uz/api/v1/teacher",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedTeachers = response.data.data.map((teacher: any) => {
          const [firstName, ...rest] = teacher.full_name.split(" ");
          const lastName = rest.join(" ");
          const dob = teacher.data_of_birth
            ? new Date(teacher.data_of_birth)
                .toLocaleDateString("uz-UZ")
                .replace(/\-/g, ".")
            : "Noma'lum";

          return {
            id: teacher.user_id,
            full_name: teacher.full_name,
            firstname: firstName,
            lastName: lastName,
            dob: dob,
            gender: teacher.gender === "MALE" ? "Erkak" : "Ayol",
            contact: {
              phone: teacher.phone_number || "Noma'lum",
            },
            images: teacher.images || [],
          };
        });

        setTeachers(formattedTeachers);
      } catch (error) {
        toast.error("O'qituvchilarni olishda xatolik yuz berdi");
      }
    };

    fetchTeachers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const storedData = localStorage.getItem("auth");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const token = parsedData?.state.token;

      await axios.delete(
        `https://api.admin.bekzodjon.uz/api/v1/teacher/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("O‘qituvchi muvaffaqiyatli o‘chirildi");
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      toast.error("O‘chirishda xatolik yuz berdi");
    } finally {
      setSelectedTeacherId(null);
    }
  };

  const getGenderLabel = (gender: string) => {
    const lower = gender.toLowerCase();
    return lower === "erkak"
      ? { label: "Og'il bola", bg: "bg-green-100", text: "text-green-700" }
      : { label: "Qiz bola", bg: "bg-pink-100", text: "text-pink-700" };
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden px-[20px] pr-[44px]">
      <Toaster position="top-center" />

      <div className="h-[82px] flex items-center justify-between border-b border-black">
        <h1 className="text-2xl font-semibold m-0 p-0">
          O’qituvchilar jadvali
        </h1>
        <div className="flex items-center gap-[15px]">
          <button
            onClick={() => navigate("/teachers/add")}
            className="flex items-center gap-2 bg-[#F9F9F9] text-[#3AADA8] px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 shadow-sm"
          >
            <span className="w-5 h-5 flex items-center justify-center bg-[#3AADA8] text-white rounded-md shadow-md">
              +
            </span>
            Qo‘shish
          </button>
        </div>
      </div>

      <div className="px-[20px] pr-[44px] mt-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left text-xs text-gray-500 font-light">
            <tr>
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">F.I.O</th>
              <th className="px-4 py-3">Tug‘ilgan sana</th>
              <th className="px-4 py-3">Jinsi</th>
              <th className="px-4 py-3">Kontakt</th>
              <th className="px-4 py-3">Imkonyatlar</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600 divide-y">
            {teachers.map((teacher, index) => {
              const gender = getGenderLabel(teacher.gender);
              return (
                <tr key={teacher.id} className="relative">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border rounded"
                      />
                      <span>{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 flex items-center gap-2">
                    <img
                      src={
                        teacher.images.length > 0
                          ? `http://localhost:4000/uploads/${teacher.images[0].url}`
                          : "/Frame 16.png"
                      }
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{teacher.full_name}</span>
                  </td>
                  <td className="px-4 py-4">{teacher.dob}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${gender.bg} ${gender.text}`}
                    >
                      {gender.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">{teacher.contact?.phone}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-[8px] relative">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <img src="/Pen.png" alt="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() =>
                          setSelectedTeacherId(
                            selectedTeacherId === teacher.id ? null : teacher.id
                          )
                        }
                      >
                        <img
                          src="/Trash Bin Trash.png"
                          alt="Delete"
                          className="w-4 h-4"
                        />
                      </button>

                      {selectedTeacherId === teacher.id && (
                        <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-300 rounded shadow-lg p-4 w-48">
                          <p className="mb-3 font-medium text-sm">
                            Ishonchingiz komilmi?
                          </p>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedTeacherId(null)}
                              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                            >
                              Yo‘q
                            </button>
                            <button
                              onClick={() => handleDelete(teacher.id)}
                              className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
                            >
                              Ha
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
