import React, { useRef, useState, useEffect } from "react";

import { BsPerson } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import axios from "../../api/axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 8 letters, atleast 1 letter and 1 number
const REGISTER_URL = "/register";

const Signup = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("false");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //revalidate if hacked
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="h-screen w-full grid place-items-center">
      <div className="w-1/3 bg-black rounded-2xl shadow-lg p-6">
        {success ? (
          <div className="mx-auto">
            <p className="text-green-200">Signed up successfully</p>
            <button className="w-full py-2 border mt-4 text-sm text-slate-100 rounded hover:border-blue-400 hover:text-blue-400">
              Log In
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center">
              <h1 className="text-2xl text-slate-50 text-center">Sign Up</h1>
              <VscAccount className="text-slate-100 ml-2" />
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
                <span className={validName ? "inline" : "hidden"}>
                  <TiTick className="text-green-500" />
                </span>
                <span className={validName || !user ? "hidden" : "inline"}>
                  <RxCrossCircled className="text-red-500" />
                </span>
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
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  className="bg-slate-900 border border-slate-500 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="randomuser_123"
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <p
                id="uidnote"
                className={`text-slate-300 text-sm mb-8 bg-slate-900 p-2 rounded ${
                  userFocus && user && !validName ? "" : "hidden"
                }`}
              >
                <MdErrorOutline /> <br />
                4 to 20 characters. <br />
                Must begin with a letter. <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>

              <label
                htmlFor="password"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-100"
              >
                Your Password
                <span className={validPwd ? "inline" : "hidden"}>
                  <TiTick className="text-green-500" />
                </span>
                <span className={validPwd || !pwd ? "hidden" : "inline"}>
                  <RxCrossCircled className="text-red-500" />
                </span>
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
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  className="bg-slate-900 border border-slate-500 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="********"
                />
              </div>
              <p
                className={`text-slate-300 text-sm mb-8 bg-slate-900 p-2 rounded ${
                  pwdFocus && !validPwd ? "" : "hidden"
                }`}
              >
                <MdErrorOutline /> <br />
                4 to 20 characters. <br />
                Must begin with a letter. <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>

              <label
                htmlFor="confirmPass"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-100"
              >
                Confirm Password
                <span className={validMatch && matchPwd ? "inline" : "hidden"}>
                  <TiTick className="text-green-500" />
                </span>
                <span className={validMatch || !matchPwd ? "hidden" : "inline"}>
                  <RxCrossCircled className="text-red-500" />
                </span>
              </label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <RiLockPasswordLine className="text-slate-100" />
                </div>
                <input
                  type="password"
                  id="confirmPass"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmNote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className="bg-slate-900 border border-slate-500 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="********"
                />
              </div>
              <p
                id="confirmNote"
                className={`text-slate-300 text-sm mb-8 bg-slate-900 p-2 rounded ${
                  matchFocus && !validMatch ? "" : "hidden"
                }`}
              >
                <MdErrorOutline /> <br />
                Must match the first password field.
              </p>

              <button
                disabled={!validName || !validPwd || !validMatch ? true : false}
                type="submit"
                className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus-ring-blue-100 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center disabled:bg-slate-600 disabled:opacity-auto"
              >
                Sign Up
              </button>
            </form>

            <h3 className="text-slate-200 text-sm py-4">Already Registered?</h3>
            <button className="bg-transparent px-4 rounded-lg text-sm py-2 text-slate-200 border hover:border-blue-400 hover:text-blue-400">
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
