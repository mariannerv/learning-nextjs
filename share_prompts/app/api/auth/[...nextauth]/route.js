import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "yourDatabaseName";

async function connectDB() {
  const client = await MongoClient.connect(MONGODB_URI);
  return client.db(DB_NAME);
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = await connectDB();
        const usersCollection = db.collection("users");

        // Find user by email
        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        if (!user) throw new Error("User not found");

        // Compare password with hashed password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return { email: user.email, id: user._id };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
