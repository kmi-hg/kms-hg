"use client";
import { useState } from "react";
import { signInAction } from "./loginAction";

const SignInPage = () => {

  const [error, setError] = useState<string>("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">
          Sign In
        </h2>

        <form
          action={async (formdata)=>{
            const res = await signInAction(formdata)
            if(res){
              setError(res)
            }
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="nrp"
              className="block text-sm font-medium text-gray-700"
            >
              NRP
            </label>
            <input
              type="text"
              id="nrp"
              name="nrp"
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            ></button>
          </div>
          <div className="text-gray-700">{error}</div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default SignInPage;
