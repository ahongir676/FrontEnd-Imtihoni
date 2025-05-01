import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="ml-[239px] mt-[94px] p-4 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
