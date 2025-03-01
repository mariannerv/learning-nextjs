import { hash } from "bcryptjs";
import User from "../../../../models/user";
import { connectToDB } from "../../../../utils/database";

export async function POST(req) {
  try {
    await connectToDB(); //espera pela ligação ao MONGO
    const { name, email, password } = await req.json(); //fica à espera dos parametros para criar um utilizador, isto basicamente torna-se numa API Endpoint

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email is already in use" }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create new user
    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }),
      { status: 500 }
    );
  }
}
