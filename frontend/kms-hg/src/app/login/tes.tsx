"use client";
import { useState } from "react";
import { signInAction } from "./loginAction";

const SignInPage = () => {
  const [error, setError] = useState<string>("");

  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden box-border">
      {/* Container utama dengan dua kolom */}
      {/* Kolom 1: Form Sign In */}
      <div className="w-1/3 p-[24px] flex flex-col justify-between h-full">
        <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
        <form
          action={async (formdata) => {
            const res = await signInAction(formdata);
            if (res) {
              setError(res);
            }
          }}
        >
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div className="text-red-500 mb-4">{error}</div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-500 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 flex justify-center w-full">
          <button className="w-full py-2 text-blue-500 border border-blue-500 rounded-lg focus:outline-none hover:bg-blue-100">
            Sign in with Google
          </button>
        </div>

        <div className="mt-4 text-center text-sm">
          <span>Need an account?</span>
          <a href="/create" className="text-blue-500">
            {" "}
            Create one
          </a>
        </div>
      </div>

      {/* Kolom 2: Box Biru */}
      <div className="h-full w-2/3 p-12 bg-blue-500 rounded-2xl flex items-center justify-center">
        <div className="text-white font-semibold text-xl">
          <p>Welcome to Revolutie</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;


