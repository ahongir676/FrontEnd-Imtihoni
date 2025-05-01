import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Groups = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const storedData = localStorage.getItem("auth");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const token = parsedData?.state.token;

      const response = await axios.get("http://localhost:4000/api/v1/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedGroups = response.data.data.map((group: any) => ({
        id: group.group_id,
        name: group.name,
        startDate: group.start_date,
        groupNumber: group.group_number,
        description: group.description || "No description available",
      }));

      setGroups(formattedGroups);
    } catch (error) {
      toast.error("Ma'lumotlarni olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const storedData = localStorage.getItem("auth");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const token = parsedData?.state.token;

      await axios.delete(`http://localhost:4000/api/v1/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Guruh muvaffaqiyatli o‘chirildi");
      setGroups((prev) => prev.filter((group) => group.id !== id));
    } catch (error) {
      toast.error("So‘rovda xatolik yuz berdi");
    } finally {
      setShowConfirm(false);
      setSelectedGroupId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative bg-white shadow rounded-lg overflow-hidden px-[20px] pr-[44px]">
      <Toaster position="top-center" />

      <div className="h-[82px] flex items-center justify-between border-b border-black">
        <h1 className="text-2xl font-semibold m-0 p-0">Guruhlar jadvali</h1>
        <div className="flex items-center gap-[15px]">
          <button
            onClick={() => navigate("/groups/add")}
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
              <th className="w-[302px] px-4 py-3">Nomi</th>
              <th className="w-[347px] px-4 py-3">Boshlangan sana</th>
              <th className="w-[293px] px-4 py-3">Guruh haqida</th>
              <th className="w-[113px] px-4 py-3 text-center">Imkonyatlar</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 font-semibold divide-y">
            {groups.map((group, index) => (
              <tr key={group.id} className="relative">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="w-4 h-4 border rounded" />
                    <span>{index + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-4">{group.name}</td>
                <td className="px-4 py-4">
                  {new Date(group.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">{group.description}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-center items-center gap-2 relative">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <img src="/Pen.png" alt="Edit" className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() =>
                          setSelectedGroupId(
                            group.id === selectedGroupId ? null : group.id
                          )
                        }
                      >
                        <img
                          src="/Trash Bin Trash.png"
                          alt="Delete"
                          className="w-4 h-4"
                        />
                      </button>

                      {selectedGroupId === group.id && (
                        <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-300 rounded shadow-lg p-4 w-48">
                          <p className="mb-3 font-medium text-sm">
                            Ishonchingiz komilmi?
                          </p>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedGroupId(null)}
                              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                            >
                              Yo‘q
                            </button>
                            <button
                              onClick={() => handleDelete(group.id)}
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

      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4 font-semibold text-lg">Ishonchingiz komilmi?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedGroupId(null);
                }}
              >
                Yo‘q
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  if (selectedGroupId) {
                    handleDelete(selectedGroupId);
                  }
                }}
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
