import React, { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success === true) {
        dispatch(setAuthUser(response.data.user));
        navigate("/");
        toast.success(response.data.message);
        input({ username: "", email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  const signUpWithGoogleHandler = async () => {
    try {
      setLoading(true);
      // Redirect to Google OAuth authentication route
      window.location.href = `${VITE_GOOGLE_URL}`;
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8 rounded-md"
      >
        <div className="my-4 text-center">
          <h1 className="text-xl font-bold">Logo</h1>
          <p className="text-sm">
            Sign up to see photos and videos from your friends
          </p>
        </div>
        <div>
          <Label htmlFor="username">Username </Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <Label htmlFor="email">Email </Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <Label htmlFor="password">Password </Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-2 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Sign Up</Button>
        )}
        <span>
          Already have an account?{" "}
          <Link className="text-blue-700" to="/login">
            Login
          </Link>
        </span>
        <div className="flex flex-row items-center justify-center">
          <hr className="border-gray-700 w-[80px]" />
          <span className="text-sm font-bold px-2">OR</span>
          <hr className="border-gray-700 w-[80px]" />
        </div>
        <div className="flex flex-col">
          <Button onClick={signUpWithGoogleHandler} className="cursor-pointer">
            <FaGoogle /> <span>Sign up with Google</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
