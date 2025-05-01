import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { instance } from "../../config/axios-instance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser, setToken, setRefreshToken } = useAuthStore((store) => store);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      console.log(username, password);
      const res = await instance.post("auth/login", {
        username,
        password,
      });

      if (!res.data || typeof res.data !== "object") {
        setError("Server responded with an invalid response.");
        return;
      }

      if (res.data.status === 200 && res.data.data) {
        const { accessToken, refreshToken } = res.data.data;
        setUser({ username });
        setToken(accessToken);
        setRefreshToken(refreshToken);

        navigate("/");
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(
        "Login failed: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="bg-white w-full h-screen flex items-center justify-center">
      <div className="w-[1215px] h-[1080px] flex items-center justify-center">
        <form onSubmit={loginHandler} className="w-full max-w-[400px] bg-white">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Tizimga kirish
          </h2>

          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-gray-400 focus:border-[#7D41ED] outline-none py-2 pl-4 pr-10 text-gray-800 placeholder:text-gray-800 placeholder:font-semibold text-base"
            />
            <img
              src="/Frame.png"
              alt="user icon"
              className="w-5 h-5 absolute right-3 top-2.5"
            />
          </div>

          <div className="mb-8 relative">
            <input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-400 focus:border-[#7D41ED] outline-none py-2 pl-4 pr-10 text-gray-800 placeholder:text-gray-800 placeholder:font-semibold text-base"
            />
            <img
              src="/Frame (1).png"
              alt="lock icon"
              className="w-5 h-5 absolute right-3 top-2.5"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white rounded-md transition text-lg font-medium"
            style={{ backgroundColor: "#7D41ED" }}
          >
            Kirish
          </button>
          {error &&
            (() => {
              let displayMessage = "";
              switch (error) {
                case "Login failed: Invalid credentials":
                  displayMessage = "Login yoki parol noto‘g‘ri.";
                  break;
                case " Login failed: User not found":
                  displayMessage = "Bunday foydalanuvchi mavjud emas.";
                  break;
                case "Login failed:  Password is incorrect":
                  displayMessage = "Parol noto‘g‘ri kiritilgan.";
                  break;
                default:
                  displayMessage = error;
              }

              return (
                <div className="mt-4 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm text-center">
                  {displayMessage}
                </div>
              );
            })()}
        </form>
      </div>
    </div>
  );
};

export default Login;
