import type { NextAuthConfig, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = (user as any)._id?.toString?.() ?? (user as any)._id;
                token.isAdmin = (user as any).isAdmin;
            }
            return token as JWT;
        },
        async session({ session, token }) {
            const _session = session as Session;
            if (token) {
                (_session.user as any).userId = (token as any).userId;
                (_session.user as any).isAdmin = (token as any).isAdmin;
            }
            return _session;
        },
        async authorized({ auth, request }) {
            const user = auth?.user;
            const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login") || request.nextUrl?.pathname.startsWith("/register");
            const isOnCartPage = request.nextUrl?.pathname.startsWith("/cart");
            const isOnCartsPage = request.nextUrl?.pathname.startsWith("/carts");

            if (isOnLoginPage && user) {
                return Response.redirect(new URL("/carts", request.nextUrl));
            }
            if(isOnCartPage && !user)
            {
                return Response.redirect(new URL("/login", request.nextUrl));
            }
            if(isOnCartsPage && !user){
                return Response.redirect(new URL("/login", request.nextUrl));
            }
            
            return true;
        }
    }
};




