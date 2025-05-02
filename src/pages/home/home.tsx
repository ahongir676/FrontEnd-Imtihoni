import { useEffect, useState } from "react";
import { User, BarChart, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface Payment {
  [key: string]: any;
}

interface StudentType {
  id: string;
  full_name: string;
  firstname: string;
  lastName: string;
  username: string;
  address: string;
  phone: string;
  dob: string;
  birthYear: number | null;
  gender: string;
  originalGender: "MALE" | "FEMALE";
  group: string;
  attendance: boolean;
  payments: Payment[];
  image: string | null;
  age?: number;
}

interface TeacherType {
  id: string;
  full_name: string;
  firstname: string;
  lastName: string;
  username: string;
  address: string;
  phone: string;
  dob: string;
  birthYear: number | null;
  gender: string;
  originalGender: "MALE" | "FEMALE";
  attendance: boolean;
  image: string | null;
}

interface PieChartStat {
  range: string;
  percentage: number;
  color: string;
  count?: number;
}

function Home() {
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [pieChartStats, setPieChartStats] = useState<PieChartStat[]>([
    { range: "A", percentage: 30, color: "#4CAF50" },
    { range: "B", percentage: 20, color: "#2196F3" },
    { range: "C", percentage: 25, color: "#FFC107" },
    { range: "D", percentage: 25, color: "#F44336" },
  ]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem("auth");
        const parsedData = storedData ? JSON.parse(storedData) : null;
        const token = parsedData?.state?.token;

        if (!token) {
          toast.error("Avtorizatsiya ma'lumotlari topilmadi");
          return;
        }

        const [studentRes, teacherRes] = await Promise.all([
          axios.get("https://api.admin.bekzodjon.uz/api/v1/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://api.admin.bekzodjon.uz/api/v1/teacher", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const formattedTeachers = teacherRes.data.data.map((teacher: any) => {
          const [firstName, ...rest] = teacher.full_name?.split(" ") || [
            "",
            "",
          ];
          const lastName = rest.join(" ");

          return {
            id: teacher.user_id,
            full_name: teacher.full_name || "",
            firstname: firstName,
            lastName: lastName,
            username: teacher.username || "",
            address: teacher.address || "",
            phone: teacher.phone_number || "",
            dob: teacher.data_of_birth
              ? new Date(teacher.data_of_birth)
                  .toLocaleDateString("uz-UZ")
                  .replace(/\-/g, ".")
              : "Noma'lum",
            birthYear: teacher.data_of_birth
              ? new Date(teacher.data_of_birth).getFullYear()
              : null,
            gender: teacher.gender === "MALE" ? "Erkak" : "Ayol",
            originalGender: teacher.gender || "MALE",
            attendance: true,
            image: teacher.images?.[0]?.url || null,
          };
        });

        const formattedStudents = studentRes.data.data.map((student: any) => {
          let age = null;
          try {
            const birthDate = new Date(student.data_of_birth);
            if (!isNaN(birthDate.getTime())) {
              age = new Date().getFullYear() - birthDate.getFullYear();
            }
          } catch (e) {}

          const groupName =
            student.group_members?.length &&
            student.group_members[0]?.group?.name
              ? student.group_members[0].group.name
              : "Guruh yo'q";

          const [firstName, ...rest] = student.full_name?.split(" ") || [
            "",
            "",
          ];
          const lastName = rest.join(" ");

          return {
            id: student.user_id,
            full_name: student.full_name || "",
            firstname: firstName,
            lastName: lastName,
            username: student.username || "",
            address: student.address || "",
            phone: student.phone_number || "",
            dob: student.data_of_birth
              ? new Date(student.data_of_birth)
                  .toLocaleDateString("uz-UZ")
                  .replace(/\-/g, ".")
              : "Noma'lum",
            birthYear: student.data_of_birth
              ? new Date(student.data_of_birth).getFullYear()
              : null,
            gender: student.gender === "MALE" ? "Erkak" : "Ayol",
            originalGender: student.gender || "MALE",
            group: groupName,
            attendance: true,
            payments: student.PaymentForStudent || [],
            image: student.images?.[0]?.url || null,
            age,
          };
        });

        const ageGroups = {
          "1–15 yosh": 0,
          "16–23 yosh": 0,
          "24–32 yosh": 0,
        };

        formattedStudents.forEach((student: StudentType) => {
          const age = student.age;
          if (age && age >= 1 && age <= 15) ageGroups["1–15 yosh"] += 1;
          else if (age && age >= 16 && age <= 23) ageGroups["16–23 yosh"] += 1;
          else if (age && age >= 24 && age <= 32) ageGroups["24–32 yosh"] += 1;
        });

        const total = formattedStudents.length;

        const stats: PieChartStat[] = [
          {
            range: "1–15 yosh",
            count: ageGroups["1–15 yosh"],
            percentage:
              total > 0
                ? parseFloat(
                    ((ageGroups["1–15 yosh"] / total) * 100).toFixed(1)
                  )
                : 0,
            color: "#4ade80",
          },
          {
            range: "16–23 yosh",
            count: ageGroups["16–23 yosh"],
            percentage:
              total > 0
                ? parseFloat(
                    ((ageGroups["16–23 yosh"] / total) * 100).toFixed(1)
                  )
                : 0,
            color: "#60a5fa",
          },
          {
            range: "24–32 yosh",
            count: ageGroups["24–32 yosh"],
            percentage:
              total > 0
                ? parseFloat(
                    ((ageGroups["24–32 yosh"] / total) * 100).toFixed(1)
                  )
                : 0,
            color: "#fbbf24",
          },
        ];

        setStudents(formattedStudents);
        setTeachers(formattedTeachers);
        setPieChartStats(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Ma'lumotlarni olishda xatolik yuz berdi");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Asosiy bo'lim</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden lg:w-3/4">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    O'qituvchilar soni:
                  </h2>
                  <span className="ml-2 text-lg text-gray-600">
                    {teachers.length} ta
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="p-2 bg-white border border-gray-300 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="6"
                        height="6"
                        rx="1"
                        stroke="#333"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="9"
                        y="1"
                        width="6"
                        height="6"
                        rx="1"
                        stroke="#333"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="1"
                        y="9"
                        width="6"
                        height="6"
                        rx="1"
                        stroke="#333"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="9"
                        y="9"
                        width="6"
                        height="6"
                        rx="1"
                        stroke="#333"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-sm ${
                      activeTab === "all"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    O'qituvchilar
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-sm ${
                      activeTab === "subject"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => setActiveTab("subject")}
                  >
                    Tarbiyachilar
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-sm ${
                      activeTab === "special"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => setActiveTab("special")}
                  >
                    Ishchilar
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      O'qituvchilar F.I.O
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tug'ilgan sana
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Jinsi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kontakt
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Yashash manzil
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher, index) => (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4 max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {teacher.firstname}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.birthYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            teacher.gender === "Erkak"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          {teacher.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.address}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:w-1/4 space-y-4">
            <div className="bg-white rounded-lg shadow p-3 relative overflow-hidden">
              <div className="flex items-center z-10 relative">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mr-2">
                  <TrendingUp size={16} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xs text-gray-600 font-medium">
                    Kirimlar
                  </h3>
                  <p className="text-lg font-bold text-gray-800">
                    12 000 000 so'm
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex items-center text-xs text-green-600">
                  <span className="font-medium">Kechagi kunga nisbatan</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-green-100 rounded text-xs">
                    +30%
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2 z-0">
                <div className="w-16 h-16 bg-teal-50 rounded-full opacity-80"></div>
              </div>
              <div className="absolute top-2 right-6 z-0">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              </div>
              <div className="absolute top-4 right-2 z-0">
                <div className="w-1 h-1 bg-teal-800 rounded-full"></div>
              </div>
              <div className="absolute top-6 right-10 z-0">
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 relative overflow-hidden">
              <div className="flex items-center z-10 relative">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mr-2">
                  <BarChart size={16} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xs text-gray-600 font-medium">
                    Chiqimlar
                  </h3>
                  <p className="text-lg font-bold text-gray-800">
                    12 000 000 so'm
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex items-center text-xs text-green-600">
                  <span className="font-medium">O'tgan haftaga nisbatan</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-green-100 rounded text-xs">
                    +30%
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2 z-0">
                <div className="w-16 h-16 bg-teal-50 rounded-full opacity-80"></div>
              </div>
              <div className="absolute top-2 right-6 z-0">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              </div>
              <div className="absolute top-4 right-2 z-0">
                <div className="w-1 h-1 bg-teal-800 rounded-full"></div>
              </div>
              <div className="absolute top-6 right-10 z-0">
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 relative overflow-hidden">
              <div className="flex items-center z-10 relative">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mr-2">
                  <User size={16} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xs text-gray-600 font-medium">
                    Bolalar soni
                  </h3>
                  <p className="text-lg font-bold text-gray-800">442 ta</p>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex items-center text-xs text-green-600">
                  <span className="font-medium">O'tgan oyga nisbatan</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-green-100 rounded text-xs">
                    +30%
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2 z-0">
                <div className="w-16 h-16 bg-teal-50 rounded-full opacity-80"></div>
              </div>
              <div className="absolute top-2 right-6 z-0">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              </div>
              <div className="absolute top-4 right-2 z-0">
                <div className="w-1 h-1 bg-teal-800 rounded-full"></div>
              </div>
              <div className="absolute top-6 right-10 z-0">
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Bugun kelgan bolalar soni:
              </h2>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-gray-600">Sana:</span>
                <span className="ml-2 text-gray-800">
                  {new Date().toLocaleDateString("uz-UZ").replace(/\-/g, ".")}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-800 font-medium">
                  {students.length} ta
                </span>
              </div>
            </div>

            <div className="overflow-x-auto max-h-56">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Bolalar F.I.O
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Jinsi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((kid, index) => (
                    <tr key={kid.id}>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={16} className="text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-2 max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {kid.firstname}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            kid.gender === "Erkak"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          {kid.gender}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Bolalarni yosh bo'yicha statistikasi
              </h2>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold text-teal-600">100%</div>
                <span className="ml-2 text-lg text-gray-600">
                  {students.length} ta
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative h-40 w-40 my-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="20"
                  />

                  {pieChartStats.map((stat, index) => {
                    // Safe calculation to avoid NaN or undefined
                    const circumference = 2 * Math.PI * 40;
                    const totalPercentage = pieChartStats.reduce(
                      (acc, curr) => acc + (curr.percentage || 0),
                      0
                    );

                    // Normalize percentages if total is not 100%
                    const normalizedPercentage =
                      totalPercentage > 0
                        ? (stat.percentage / totalPercentage) * 100
                        : 0;

                    const offset = pieChartStats
                      .slice(0, index)
                      .reduce((acc, curr) => acc + (curr.percentage || 0), 0);

                    // Normalize offset too
                    const normalizedOffset =
                      totalPercentage > 0
                        ? (offset / totalPercentage) * 100
                        : 0;

                    const segmentLength =
                      (normalizedPercentage / 100) * circumference;
                    const segmentOffset =
                      (normalizedOffset / 100) * circumference;
                    const dashArray = `${segmentLength} ${
                      circumference - segmentLength
                    }`;
                    const dashOffset = -segmentOffset;

                    return (
                      <circle
                        key={stat.range}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={stat.color}
                        strokeWidth="20"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 50 50)"
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="30" fill="white" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieChartStats.map((stat) => (
                <div key={stat.range} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{stat.range}</span>
                  <span className="ml-auto text-sm font-medium">
                    {stat.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
