import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectToDb } from "./utils";
import { User } from "./models";
import bcrypt from "bcryptjs";
import { authConfig } from "./authConfig.config";
interface ICredentials {
    username: string;
    password: string;
};
interface IUserFormData {
    username: string;
    password: string;
    rePassword: string;
    img?: string;
    email?: string;
}
export const login = async (credentials: any) => {
    try {
        connectToDb();
        
        console.log("credentials", credentials);
        // check user id (change it to lowercase) and password
        const user = await User.findOne({ username: credentials.username.toString().toLowerCase() });
        if (!user) throw new Error("Wrong credentials!");


        const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
        );
        if (!isPasswordCorrect) throw new Error("Wrong credentials!");

        return user;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to login!");
    }

}


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          }),
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const user = await login(credentials);

                    console.log("🚀 ~ authorize ~ user:", user);
                    const userPlainObject = JSON.parse(JSON.stringify(user));
                    console.log("return");
                    
                    return user;
                } catch (err) {
                    console.log(err);
                    return null;
                }
            }
        }),],
    callbacks: {
        async signIn({ user, account, profile }) {
            //   console.log("profile: ");
            //   console.log(profile);

            if (account?.provider === "google") {
                connectToDb();
                try {
                    const user = await User.findOne({ email: profile?.email });
                    if (!user) {
                        const newUser = new User({
                            username: profile?.login,
                            email: profile?.email,
                            img: profile?.avatar_url,
                        });
                        await newUser.save();
                    }
                } catch (e) {
                    // console.log(e);
                    return false;
                }
            }
            return true;
        },
        ...authConfig.callbacks,
    },
});
