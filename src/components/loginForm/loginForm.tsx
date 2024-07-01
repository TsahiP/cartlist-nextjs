"use client";
import { login } from "@/lib/actions";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFormState } from "react-dom";

const LoginForm = () => {
  const [state,formAction] = useFormState(login,undefined);
  return (
    <div className="border border-solid border-gray-300 rounded p-7 ">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">Login</h1>
      </div>
      <div>
        <form action={formAction} className=" flex flex-col space-y-4 items-center justify-center">
          <div>
            {/* <label className="text-sm font-medium">Email</label> */}
            <input
              placeholder="Email Address"
              className="border border-gray-300 rounded-md px-4 py-2"
              type="string"
              name="userId"
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
          <Button className="w-full">Login with Credentials </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
