"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  //isto são funções do react-hook-form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = form;


  //função só pra confirmar a password
  function validatePasswordMatch(value) {
    if (value !== getValues().password) {
      return "Passwords don't match";
    }
    return true;
  }


// The POST function is coming from your route.js file, which defines an API route for handling user registration.

// How It Works:
// Frontend (page.jsx)

// When the form is submitted, the onSubmit function is triggered.
// This function sends a POST request to "/api/auth/register" using fetch().
// The request includes user details (name, email, password) in JSON format.

// Backend (route.js)

// This file defines an API route that listens for POST requests.
// The POST function:
// Connects to the database.
// Extracts and normalizes the user input.
// Checks if the email is already registered.
// Hashes the password using bcryptjs.
// Creates a new user in the database.
// Returns a success or error response.
// How Next.js Connects Them

// In Next.js, files in app/api/auth/register/route.js (or pages/api in older versions) automatically become API endpoints.
// When fetch("/api/auth/register") is called in page.jsx, it reaches route.js, processes the request, and sends back a response.
// That’s why you don’t explicitly see the POST function in page.jsx—it’s handled via API routing in route.js. 🚀
async function onSubmit(values) {
  try {
    setIsLoading(true);
    const { confirmPassword, ...submitData } = values;
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error === "Email is already in use") {
        form.setError("email", {
          type: "manual",
          message: "This email is already registered. Try logging in.",
        });
      } else {
        throw new Error(data.error || "Registration failed");
      }
      return;
    }

    toast.success("Registration successful! Please sign in.");
    form.reset();
    router.push("/login");
  } catch (error) {
    form.setError("email", {
      type: "manual",
      message: error.message || "Something went wrong. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="mt-6 text-center text-3xl font-extrabold orange_gradient">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </p>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters.",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address.",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="youremail@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: validatePasswordMatch,
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center black_btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
