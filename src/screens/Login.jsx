import React, { useEffect, useState } from "react";
import validator from "validator";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../API/API";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import logo1 from "../assets/logo1.png";
import Icon from "../components/Icon/Icon";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import BlockUi from "@availity/block-ui";
import Loading from "react-loading";
import CustomLoader from "../components/Loader/CustomLoader";
function Login() {
  const iconColor = "rgb(55 65 81)";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, []);
  const handleLogin = async () => {
    if (!validator.isEmail(email)) {
      setEmailError(true);
      return;
    }
    if (password.trim().length < 8) {
      setPasswordError(true);
      return;
    }
    const payload = {
      email,
      password,
    };
    try {
      setLoading(true);
      const res = await axios.post(API.Auth.login, payload);
      setLoading(false);
      toast.success("Login Successfull !");
      login(res.data.access_token);
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
    <BlockUi blocking={loading} loader={<CustomLoader size={50} color={"blue"}/>}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white lg:p-8 px-8 py-6  lg:pb-3 pb-2 rounded-xl shadow-md lg:w-96 w-80">
          <div className="flex justify-center">
            <div className="w-[160px] mb-1.5">
              <img src={logo1} alt="Company Logo" className="mx-auto" />
            </div>
          </div>
          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full p-2 border-2 rounded-md focus:outline-none ${
                emailError ? "border-red-600" : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
            />
            {emailError && (
              <p className="text-xs text-right">Invalid email !</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full p-2 border-2 rounded-md focus:outline-none ${
                  passwordError ? "border-red-600" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3"
              >
                {!showPassword && (
                  <Icon color={iconColor} size={20} icon={LuEye} />
                )}
                {showPassword && (
                  <Icon color={iconColor} size={20} icon={LuEyeOff} />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-right">
                Password must be 8 characters !
              </p>
            )}
          </div>
          <button
            className="w-full bg-blue-500 text-white font-bold py-2 px-5 rounded-md focus:outline-none hover:bg-blue-600"
            onClick={handleLogin}
          >
            Log In
          </button>
          <p className="text-sm text-center my-4">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-blue-500">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </BlockUi>
    </>
  );
}

export default Login;
