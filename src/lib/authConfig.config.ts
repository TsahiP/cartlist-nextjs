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

            if (isOnLoginPage && user) {
                return Response.redirect(new URL("/", request.nextUrl));
            }
            return true;
        }
    }
};
// export const authConfig = {
//     pages: {
//         signIn: "/login",
//     },
//     providers: [],
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user._id;
//                 token.isAdmin = user.isAdmin;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user.id = token.id;
//                 session.user.isAdmin = token.isAdmin;
//             }
//             return session;
//         },
//         async authorized({ auth, request }) {
//             const user = auth?.user;
//             // const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
//             // const isOnBlogPage = request.nextUrl?.pathname.startsWith("/blog");
//             const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");

//             if (isOnLoginPage && user) {
//                 return Response.redirect(new URL("/", request.nextUrl));
//             }
//             return true;
//         }
//     }
// };




// export const authConfig = {
//     pages: {
//         signIn: "/login",

//     },
//     providers: [],
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user._id;
//                 token.isAdmin = user.isAdmin;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user.id = token.id;
//                 session.user.isAdmin = token.isAdmin;
//             }
//             return session;
//         },
//         authorized({ auth, request }) {
//             const user = auth?.user;
//             // const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
//             // const isOnBlogPage = request.nextUrl?.pathname.startsWith("/blog");
//             const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");

//             // // only admin can see admin panel
//             // if (isOnAdminPanel && !user?.isAdmin) {
//             //     return false;
//             // }
//             // // only logged in users can see blog page
//             // if (isOnBlogPage && !user) {
//             //     return false;
//             // }
//             // only logged out users can see login page
//             if (isOnLoginPage && user) {
//                 return Response.redirect(new URL("/", request.nextUrl)) ;
//             }
//             return true;

//         }
//     }
// }