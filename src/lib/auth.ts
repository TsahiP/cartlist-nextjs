import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectToDb } from "./utils";
import { User } from "./models";
// import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
interface ICredentials {
    userId: string;
    password: string;
};
interface IUser {
    userId: string;
    password: string;
    name: string;
    email: string;
    img: string;
    isAdmin: boolean;
}
export const login = async (credentials: any) => {
    try {
        connectToDb();
        const user = await User.findOne({ userId: credentials.userId });
        if (!user) {
            return ({ error: "Wrong credentials!" });
        }
        console.log("user data", user);

        // const isPasswordCorrect = await bcrypt.compare(
        //     credentials.password,
        //     user.password
        // );
        // console.log("here", isPasswordCorrect);
        // if (!isPasswordCorrect) {
        //     return ({ error: "Wrong password!" });
        //     // throw new Error("Wrong password!");
        // }
        // console.log("user", user);
        console.log(typeof user);
        return user;
    } catch (err) {
        return ({ error: "Wrong credentials!" });
    }

}


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        // ...authConfig,
        CredentialsProvider({


            async authorize(credentials) {
                try {
                    const user = await login(credentials);

                    console.log("🚀 ~ authorize: ~ credentials:", credentials)
                    return user;
                } catch (err) {


                    return null;
                }
            }
        }),],
    callbacks: {
        async signIn({ user, account, profile }) {
            //   console.log("profile: ");
            //   console.log(profile);

            // if (account.provider === "github") {
            //     connectToDb();
            //     try {
            //         const user = await User.findOne({ email: profile.email });
            //         if (!user) {
            //             const newUser = new User({
            //                 username: profile.login,
            //                 email: profile.email,
            //                 img: profile.avatar_url,
            //             });
            //             await newUser.save();
            //         }
            //     } catch (e) {
            //         // console.log(e);
            //         return false;
            //     }
            // }
            return true;
        },
        // ...authConfig.callbacks,
    },
});
