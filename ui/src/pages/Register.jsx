import React, { useState } from "react";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import goml from "../assets/goml.webp";
import ai from "../assets/ai.webp";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const res = await registerUser(username, password);
      Cookies.set("user_id", res.user_id, { expires: 7 });
      toast.success("Registration Successful");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      {/* <img
        src={ai}
        alt="AI Logo"
        width={90}
        height={90}
        className="absolute top-1 left-6"
      /> */}
      <img
        src={goml}
        alt="GoML Logo"
        width={120}
        height={120}
        className="absolute top-6 right-6"
      />

      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-md p-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">
            AI Matic CareFlow
          </h1>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">Welcome Back</h1>
          <p className="text-gray-600 mt-3 text-lg">
            Sign up to use our AI workflows
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-md text-white text-lg font-semibold cursor-pointer ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } transition`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing up...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Register
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
