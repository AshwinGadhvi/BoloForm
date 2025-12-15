import { useState, useContext } from "react";
import { loginUser } from "../../api/authApi";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [data, setData] = useState({
    emailOrMobile: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!data.emailOrMobile || !data.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await loginUser(data);
      login(res.data);
      toast.success("Login successful");

      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Email or Mobile"
            name="emailOrMobile"
            onChange={handleChange}
            placeholder="Enter email or phone number"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg 
                     font-semibold hover:bg-blue-700 transition
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* OTP Login */}
        <Link
          to="/otp-login"
          className="block text-center w-full py-2.5 rounded-lg border border-gray-300 
                     text-gray-700 hover:bg-gray-50 transition font-medium"
        >
          Login with OTP
        </Link>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
