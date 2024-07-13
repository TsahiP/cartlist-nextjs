export const authConfig: {
    pages: {
        signIn: string;
    };
    providers: any[];
    callbacks: {
        jwt: (params: { token: any; user: any }) => Promise<any>;
        session: (params: { session: any; token: any }) => Promise<any>;
        authorized: (params: { auth: any; request: any }) => Promise<boolean | Response>;
    };
} = {
    pages: {
        signIn: "/login",
    },
    providers: [],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id;
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
            }
            return session;
        },
        async authorized({ auth, request }) {
            const user = auth?.user;
            const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");
            const isOnCartPage = request.nextUrl?.pathname.startsWith("/cart");
            const isOnDeshbordPage = request.nextUrl?.pathname.startsWith("/");
            const isOnCartsPage = request.nextUrl?.pathname.startsWith("/carts");

            if (isOnLoginPage && user) {
                return Response.redirect(new URL("/carts", request.nextUrl));
            }
            if(isOnCartPage && !user)
            {
                return Response.redirect(new URL("/login", request.nextUrl));
            }
            // if (isOnDeshbordPage && user) {
            //     return Response.redirect(new URL("/carts", request.nextUrl));
            // }
            if(isOnCartsPage && !user){
                return Response.redirect(new URL("/login", request.nextUrl));
            }
            
            return true;
        }
    }
};




