import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/user";
import { connectToDB } from "../../../../utils/database";

// Define your NextAuth configuration as authOptions
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  async session({ session, token }) {
    const sessionUser = await User.findOne({
      email: session.user.email,
    });
    session.user.id = sessionUser._id.toString();
  },

  async signIn({ profile }) {
    try {
      await connectToDB();

      // Check if a user already exists
      const userExists = await User.findOne({
        email: profile.email,
      });

      // If not, create a new user
      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture,
        });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

// Export the handler for Next.js API routes
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
