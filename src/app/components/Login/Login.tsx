"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "iconsax-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Login = ({ toggleAuthForm }: { toggleAuthForm: () => void }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        if (authError) setAuthError("");
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Initialize bookmarks if not exists
            if (!localStorage.getItem("bookmarkedMovies")) {
                localStorage.setItem("bookmarkedMovies", JSON.stringify([]));
            }

            router.push("/");
        } catch (error: any) {
            console.error("Login error:", error);
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                setAuthError("Invalid email or password");
            } else {
                setAuthError("Login failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="auth page">
            <div className="auth-container">
                <section className="auth-hero">
                    <div className="auth-row">
                        <div className="auth-col"></div>
                        <div className="auth-col">
                            <h1>
                                Login to see bookmarked movies
                            </h1>
                        </div>
                    </div>
                </section>

                <section className="section auth-form">
                    <div className="auth-row">
                        <div className="auth-col">
                            <p>
                                <span>LOGIN</span>
                            </p>
                        </div>
                        <div className="auth-col">
                            <form action="">
                                <div className="input">
                                    <input type="email" placeholder="Email" />
                                </div>
                                <div className="input">
                                    <input type="password" placeholder="password" />
                                    <button>Submit</button>
                                </div>
                            </form>
                            <p>Don't have an account?
                                <button
                                    onClick={toggleAuthForm}
                                    className="text-blue-500 hover:underline cursor-pointer"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>

                    </div>
                </section>
            </div>
        </div>

    );
};

export default Login;