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
                            <h1>Login to see bookmarked movies</h1>
                        </div>
                    </div>
                </section>

                <section className="section auth-form">
                    <div className="auth-row">
                        <div className="auth-col">
                            <p><span>LOGIN</span></p>
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
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Logging in..." : "Login"}
                                </button>
                            </form>
                            <p className="auth-toggle-text">
                                Don&apos;t have an account?
                                <button
                                    type="button"
                                    onClick={toggleAuthForm}
                                    className="auth-toggle-button"
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