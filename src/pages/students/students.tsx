import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

type Group = {
  group_id: string;
  name: string;
  description: string;
};

type Payment = {
  sum: number;
  date: string;
  type: string;
};

type Student = {
  id: string;
  full_name: string;
  firstname: string;
  lastName: string;
  username: string;
  dob: string;
  gender: string;
  group: string;
  attendance: boolean;
  group_members: Group[];
  payments: Payment[];
};

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem("auth");
        const parsedData = storedData ? JSON.parse(storedData) : null;
        const token = parsedData?.state.token;

        const response = await axios.get(
          "https://api.admin.bekzodjon.uz/api/v1/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedStudents = response.data.data.map((student: any) => {
          const groupName =
            student.group_members?.length &&
            student.group_members[0]?.group?.name
              ? student.group_members[0].group.name
              : "Guruh yo'q";

          const [firstName, ...rest] = student.full_name.split(" ");
          const lastName = rest.join(" ");

          return {
            id: student.user_id,
            full_name: student.full_name,
            firstname: firstName,
            lastName: lastName,
            dob: student.data_of_birth
              ? new Date(student.data_of_birth)
                  .toLocaleDateString("uz-UZ")
                  .replace(/\-/g, ".")
              : "Noma'lum",
            birthYear: student.data_of_birth
              ? new Date(student.data_of_birth).getFullYear()
              : null,
            gender: student.gender === "MALE" ? "Erkak" : "Ayol",
            originalGender: student.gender,
            group: groupName,
            attendance: true,
            payments: student.PaymentForStudent || [],
          };
        });

        setStudents(formattedStudents);
      } catch (error) {
        toast.error("Ma'lumotlarni olishda xatolik yuz berdi");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const storedData = localStorage.getItem("auth");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const token = parsedData?.state.token;

      await axios.delete(
        `https://api.admin.bekzodjon.uz/api/v1/students/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("O‘quvchi muvaffaqiyatli o‘chirildi");
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      toast.error("O‘chirishda xatolik yuz berdi");
    } finally {
      setSelectedStudentId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden px-[20px] pr-[44px]">
      <Toaster position="top-center" />

      <div className="h-[82px] flex items-center justify-between border-b border-black">
        <h1 className="text-2xl font-semibold m-0 p-0">O’quvchilar jadval</h1>
        <div className="flex items-center gap-[15px]">
          <button
            onClick={() => navigate("/students/add")}
            className="flex items-center gap-2 bg-[#F9F9F9] text-[#3AADA8] px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 shadow-sm"
          >
            <span className="w-5 h-5 flex items-center justify-center bg-[#3AADA8] text-white rounded-md shadow-md">
              +
            </span>
            Qo‘shish
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md shadow-sm">
            <img src="/Sort.png" alt="Filter" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-left text-xs text-gray-500 font-light">
          <tr>
            <th className="px-4 py-3 text-center">#</th>
            <th className="px-4 py-3">Bolalar F.I.O</th>
            <th className="px-4 py-3">Tug‘ilgan sana</th>
            <th className="px-4 py-3">Jinsi</th>
            <th className="px-4 py-3">Guruh raqami</th>
            <th className="px-4 py-3">Davomat</th>
            <th className="px-4 py-3">To‘lov</th>
            <th className="px-4 py-3">Imkonyatlar</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-600 divide-y">
          {students.map((student, index) => (
            <tr key={student.id} className="relative">
              <td className="px-4 py-4">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4 border rounded" />
                  <span>{index + 1}</span>
                </div>
              </td>
              <td className="px-4 py-4 flex items-center gap-2">
                <img
                  src="/Frame 16.png"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span>{student.full_name}</span>
              </td>
              <td className="px-4 py-4">{student.dob}</td>
              <td className="px-4 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.gender === "Erkak"
                      ? "bg-green-100 text-green-700"
                      : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {student.gender}
                </span>
              </td>
              <td className="px-4 py-4">{student.group}</td>
              <td className="px-4 py-4">
                <div
                  className={`w-4 h-4 flex items-center justify-center rounded-md ${
                    student.attendance ? "bg-green-500" : "bg-red-500"
                  } text-white text-lg`}
                >
                  {student.attendance ? "✅" : "❌"}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="relative group">
                  <button className="bg-[#F9F9F9] text-black px-3 py-1 rounded shadow-sm">
                    To‘lov
                  </button>
                  <div className="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 text-sm z-10 hidden group-hover:block">
                    <h3 className="text-lg font-semibold text-[#1E2B4F] mb-2">
                      To‘lov jadvali
                    </h3>
                    <hr className="mb-2" />
                    <p>
                      <span className="font-semibold">Ism:</span>{" "}
                      {student.firstname}
                    </p>
                    <p>
                      <span className="font-semibold">Familiya:</span>{" "}
                      {student.lastName}
                    </p>
                    <p>
                      <span className="font-semibold">To‘lov turi:</span>{" "}
                      {student.payments[0]?.type || "Yo‘q"}
                    </p>
                    <p>
                      <span className="font-semibold">To‘lov summasi:</span>{" "}
                      {student.payments[0]?.sum || "0 so‘m"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 relative">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <img src="/Pen.png" alt="Edit" className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={() =>
                        setSelectedStudentId(
                          selectedStudentId === student.id ? null : student.id
                        )
                      }
                    >
                      <img
                        src="/Trash Bin Trash.png"
                        alt="Delete"
                        className="w-4 h-4"
                      />
                    </button>

                    {selectedStudentId === student.id && (
                      <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-300 rounded shadow-lg p-4 w-48">
                        <p className="mb-3 font-medium text-sm">
                          Ishonchingiz komilmi?
                        </p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudentId(null)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            Yo‘q
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
                          >
                            Ha
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
