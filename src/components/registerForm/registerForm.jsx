"use client";
import { useFormState } from "react-dom";
import { register } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const RegisterForm = () => {
  const [state, formAction] = useFormState(register, undefined);
  const router = useRouter();

  useEffect(() => {
    state?.success && router.push("/login");
  }, [state?.success, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Register Form</h1>
      <form className="flex flex-col items-center space-y-4 shadow-md p-4 rounded">
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="border border-gray-300 rounded-md px-4 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="border border-gray-300 rounded-md px-4 py-2" />
        <input
          type="text"
          placeholder="Image"
          name="img"
          className="border border-gray-300 rounded-md px-4 py-2" />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="border border-gray-300 rounded-md px-4 py-2" />
        <input
          type="password"
          placeholder="Confirm Password"
          name="rePassword"
          className="border border-gray-300 rounded-md px-4 py-2" />
        <button className="button-primary">Register</button>
        {state?.error}
        <Link href="/login">
          Have an account? <b>Login</b>
        </Link>
      </form>
    </div>
  );
};

export default RegisterForm;
