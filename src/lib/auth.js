import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        }),
        {
            id: "sms-otp",
            name: "SMS OTP",
            type: "credentials",
            credentials: {
                phone: { label: "Phone", type: "text" },
                code: { label: "Code", type: "text" },
            },
            async authorize(credentials) {
                const res = await fetch("http://localhost:4000/verify-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone: credentials.phone,
                        code: credentials.code,
                    }),
                });

                if (!res.ok) return null;
                const user = await res.json();
                return { id: user.id, phone: user.phone };
            },
        },
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth",
    },
};
