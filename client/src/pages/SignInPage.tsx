import Footer from "@/components/custom/Footer";
import Navbar from "@/components/custom/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/contexts/userContext";
import { useSignIn } from "@/services/auth/mutation";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useUserContext();
  const signInMutation = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    signInMutation.mutate(
      { email: normalizedEmail, password },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          toast.success("Signed in successfully!");
          navigate("/dashboard");
        },
        onError: (error: unknown) => {
          const err = error as {
            message?: string;
            response?: { data?: { error?: string } };
          };
          toast.error(
            err.response?.data?.error || err.message || "Failed to sign in"
          );
        },
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center bg-gradient-to-r from-white to-sky-100 justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignInPage;
