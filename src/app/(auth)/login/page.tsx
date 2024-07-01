import LoginForm from "@/components/loginForm/loginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Login = () => {
  return (
    <div className="border border-solid border-gray-300  flex flex-col items-center justify-center min-h-screen">
      <LoginForm/>
    </div>
  );
};

export default Login;
