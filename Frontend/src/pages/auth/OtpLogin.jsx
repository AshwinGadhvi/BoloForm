import { useState } from "react";
import { sendOtp } from "../../api/authApi";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/common/Input";

const OtpLogin = () => {
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!contact) {
      toast.error("Please enter email or mobile number");
      return;
    }

    try {
      await sendOtp({ contact });
      toast.success("OTP sent successfully");
      navigate(`/verify-otp?contact=${encodeURIComponent(contact)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Login with OTP
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            We’ll send a one-time password to your email or mobile
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <Input
            label="Email or Mobile"
            name="contact"
            placeholder="Enter email or phone number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSendOtp}
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
          Send OTP
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
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

export default OtpLogin;
