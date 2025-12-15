import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Admin Panel
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Welcome, {auth?.user?.name}
        </p>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            🔐 Role: <b>Administrator</b>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            📧 Email: {auth?.user?.email}
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
