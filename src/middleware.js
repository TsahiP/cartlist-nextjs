import NextAuth from "next-auth"
import {authConfig} from "./lib/authConfig.config";

export default NextAuth(authConfig).auth;

export const config = {
    matcher:['/((?!api|static|.*\\..*|_next).*)']
}
// T 4:24