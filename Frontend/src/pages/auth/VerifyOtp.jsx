import { useState, useContext } from "react";
import { verifyOtp } from "../../api/authApi";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Input from "../../components/common/Input";
import { AuthContext } from "../../context/AuthContext";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const contact = searchParams.get("contact");

  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const { data } = await verifyOtp({
        contact,
        otp,
        name: name || undefined,
      });

      login(data);
      toast.success("OTP verified successfully");

      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Verify OTP
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-gray-700">
              {contact}
            </span>
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <Input
            label="OTP"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Input
            label="Full Name (only required for new users)"
            name="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleVerify}
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
          Verify & Continue
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Didn’t receive OTP?{" "}
          <Link
            to="/otp-login"
            className="text-blue-600 font-medium hover:underline"
          >
            Try again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
