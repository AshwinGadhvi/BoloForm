import { useState } from "react";
import { registerUser } from "../../api/authApi";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.mobile || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await registerUser(form);
      toast.success("Registration successful");

      // Optional: redirect to login after register
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign up to get started with your dashboard
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="mobile"
            placeholder="Enter your mobile number"
            value={form.mobile}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="
            w-full mt-6
            bg-blue-600 text-white
            py-2.5 rounded-lg
            font-semibold
            hover:bg-blue-700
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
