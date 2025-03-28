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
            await createUserWithEmailAndPassword(
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
                setAuthError("Email already in use");
            } else if (error.code === "auth/weak-password") {
                setAuthError("Password should be at least 6 characters");
            } else {
                setAuthError("Signup failed. Please try again.");
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
                            <h1>Create account and get your bookmarks saved</h1>
                        </div>
                    </div>
                </section>

                <section className="section auth-form">
                    <div className="auth-row">
                        <div className="auth-col">
                            <p><span>SIGNUP</span></p>
                        </div>
                        <div className="auth-col">
                            {authError && (
                                <div className="auth-error-message">
                                    {authError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="input">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? "error" : ""}
                                    />
                                    {errors.email && (
                                        <span className="error-message">{errors.email}</span>
                                    )}
                                </div>
                                <div className="input">
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={errors.password ? "error" : ""}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <span className="error-message">{errors.password}</span>
                                    )}
                                </div>
                                <div className="input">
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={errors.confirmPassword ? "error" : ""}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <span className="error-message">{errors.confirmPassword}</span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating account..." : "Sign Up"}
                                </button>
                                <p className="auth-toggle-text">
                                    Already have an account?
                                    <button
                                        type="button"
                                        onClick={toggleAuthForm}
                                        className="auth-toggle-button"
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