"use client";
import { useState } from "react";
import { signInAction } from "./loginAction";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const SignInPage = () => {
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async (formdata: FormData) => {
    setIsLoading(true);
    const res = await signInAction(formdata);
    setIsLoading(false);

    if (res) {
      setError(res);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="absolute p-[32px]">
        <Image
          src="/Logo_Hasnur_Group.png"
          alt="Hasnur Group Logo"
          className="h-10 w-auto"
          width={40}
          height={40}
        />
      </div>
      <div className="basis-1/3 flex items-center justify-center bg-white shadow-md">
        <div className="w-full px-[64px]">
          <h2 className="text-[40px] font-bold text-black text-left">
            Sign In
          </h2>
          <p className="text-[14px] font-medium text-[#969696] mb-[32px] text-left">
            Please login to access Knowledge Management System.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formdata = new FormData(e.target as HTMLFormElement);
              await handleSignIn(formdata);
            }}
            className="flex flex-col justify-center"
          >
            <div className="mb-4">
              <label
                htmlFor="nrp"
                className="text-[12px] font-medium text-black mb-[10px]"
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
                className="text-[12px] font-medium text-black mb-[10px] block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="text-red-500 mb-2">{error}</div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3A40D4] text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg[#2A31EA]"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <div className="basis-2/3 flex items-center justify-center p-3">
        <Image
          src="/cover_signin.png"
          alt="Cover Sign In"
          className="w-full h-full object-cover rounded-[24px]"
          width={600}
          height={400}
        />
      </div>
    </div>
  );
};

export default SignInPage;
