"use client";
import { handleGoogleLogin, login } from "@/lib/actions";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFormState } from "react-dom";
import Image from "next/image";

const LoginForm = () => {
  const [state, formAction] = useFormState(login, undefined);
  return (
    <div className="font-roboto flex-1 flex items-center justify-center mt-1/2 ">
      {/* center form */}
      <div className="flex flex-col border border-solid border-gray-300 rounded-md shadow-md p-4  lg:w-1/3 md:w-1/3 sm:w-2/3">
        <div className="relative flex flex-col items-center p-4">
          <Image alt="" src={"/logo.svg"} width={140} height={140} />
          <h1 className="absolute bottom-9 text-xl font-semibold text-center text-white">
            Login
          </h1>
        </div>
        <div>
          <form
            action={formAction}
            className=" flex flex-col space-y-4 items-center justify-center"
          >
            <div>
              {/* <label className="text-sm font-medium">Email</label> */}
              <input
                placeholder="Email Address"
                className="border border-gray-300 rounded-md px-4 py-2"
                type="string"
                name="username"
              />
            </div>
            <div>
              {/* <label className="text-sm font-medium">Password</label> */}
              <input
                name="password"
                placeholder="Password"
                className="border border-gray-300 rounded-md px-4 py-2"
                type="password"
              />
            </div>
            {state?.msg?.toString()}
            <Button className="font-semibold w-[200px] ">Submit</Button>
          </form>
          <button onClick={() => handleGoogleLogin()}>Login with Google </button>
          </div>
      </div>
    </div>
  );
};

export default LoginForm;
