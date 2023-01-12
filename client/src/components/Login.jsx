import React, { useRef, useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";

import { useEffect } from "react";
import axios from "../../api/axios";
import AuthContext from "../context/AuthContext";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsPerson } from "react-icons/bs";
import { useContext } from "react";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !pwd) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await axios.get(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, pwd, roles, accessToken });
      setUser("");
      setPwd("");
      setSuccess("true");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="h-screen w-full grid place-items-center">
      <div className="w-1/3 bg-black rounded-2xl shadow-lg p-6">
        {success ? (
          <div className="mx-auto">
            <p className="text-green-200">Signin successfully</p>
            <button className="w-full py-2 border mt-4 text-sm text-slate-100 rounded hover:border-blue-400 hover:text-blue-400">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center">
              <h1 className="text-2xl text-slate-50 text-center">Login</h1>
              <AiOutlineLogin className="text-slate-100 ml-2" />
            </div>
            <p
              ref={errRef}
              className={`text-red-300 text-sm py-4 ${
                errMsg ? `block` : "hidden"
              }`}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <form className="mt-14" onSubmit={handleSubmit}>
              <label
                htmlFor="username"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-100"
              >
                Your Username
              </label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BsPerson className="text-slate-100" />
                </div>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="true"
                  required
                  className="bg-slate-900 border border-slate-500 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="randomuser_123"
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>

              <label
                htmlFor="password"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-100"
              >
                Your Password
              </label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <RiLockPasswordLine className="text-slate-100" />
                </div>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  className="bg-slate-900 border border-slate-500 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="********"
                />
              </div>

              <button
                disabled={!user || !pwd ? true : false}
                type="submit"
                className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus-ring-blue-100 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center disabled:bg-slate-600 disabled:opacity-auto"
              >
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
