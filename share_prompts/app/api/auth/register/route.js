import { hash } from "bcryptjs";
import User from "../../../../models/user";
import { connectToDB } from "../../../../utils/database";

export async function POST(req) {
  try {
    await connectToDB();
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email is already in use" }),
        {
          status: 400,
        }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
