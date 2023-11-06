import axios from "axios";
import { BASE_AUTH_URL } from "../api";
import toast from "react-hot-toast";
import { useState } from "react";
import Cookies from "js-cookie";

const Auth = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistration = async () => {
    try {
      const response = await axios.post(`${BASE_AUTH_URL}/register`, formData);
      if (response.status === 201) {
        window.location.reload();
        toast.success(response.data.message, {
          duration: 3000,
        });
        Cookies.set("token", response.data.token);
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        duration: 3000,
      });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_AUTH_URL}/login`, formData);
      if (response.status === 200) {
        window.location.reload();
        toast.success(response.data.message);
        Cookies.set("token", response.data.token);
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        duration: 3000,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      handleRegistration();
    } else {
      handleLogin();
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
  };

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6 p-12 bg-white rounded-sm shadow hover:shadow-xl"
          onSubmit={handleSubmit}
        >
          <p className="text-lg font-medium flex justify-center">
            {isRegisterMode ? "Register" : "Login"}
          </p>
          {isRegisterMode && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-500 flex items-center gap-3 justify-center">
          {isRegisterMode
            ? "Already have an account?"
            : "Don't have an account?"}
          <button
            onClick={toggleMode}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {isRegisterMode ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
