"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "iconsax-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SignUp = ({ toggleAuthForm }: { toggleAuthForm: () => void }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Initialize user's bookmarks
            localStorage.setItem("bookmarkedMovies", JSON.stringify([]));

            router.push("/");
        } catch (error: any) {
            console.error("Signup error:", error);
            if (error.code === "auth/email-already-in-use") {
                setErrors({ email: "Email already in use" });
            } else {
                setErrors({ email: "Signup failed. Please try again." });
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
                                Create account and get your bookmark saved
                            </h1>
                        </div>
                    </div>
                </section>

                <section className="section auth-form">
                    <div className="auth-row">
                        <div className="auth-col">
                            <p>
                                <span>SIGNUP</span>
                            </p>
                        </div>
                        <div className="auth-col">
                            <form action="">
                                <div className="input">
                                    <input type="email" placeholder="Email" />
                                </div>
                                <div className="input">
                                    <input type="password" placeholder="password" />
                                </div>
                                <div className="input">
                                    <input type="password" placeholder="password" />
                                    <button>Submit</button>
                                </div>
                                <p>Already have an account?
                                    <button
                                        onClick={toggleAuthForm}
                                        className="text-blue-500 hover:underline cursor-pointer"
                                    >
                                        Login
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default SignUp;