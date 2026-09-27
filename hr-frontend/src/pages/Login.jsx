import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (e) => {
        e.preventDefault();

        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please enter username and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                username,
                password
            });

            const data = response.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            if (data.employeeId !== null && data.employeeId !== undefined) {
                localStorage.setItem(
                    "employeeId",
                    String(data.employeeId)
                );
            }

            if (data.name) {
                localStorage.setItem("name", data.name);
            }

            if (data.role === "EMPLOYEE") {
                navigate("/employee");
            } else if (
                data.role === "ADMIN" ||
                data.role === "MANAGER"
            ) {
                navigate("/hr");
            } else {
                setError("Unknown user role.");
                localStorage.clear();
            }

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {
                setError("Invalid username or password.");
            } else {
                setError("Unable to connect to the server.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    HRMS
                </div>

                <h1>Welcome Back</h1>

                <p className="login-subtitle">
                    Sign in to your account
                </p>

                <form onSubmit={login}>

                    <div className="input-group">
                        <label>Username</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-content">
                                <span className="spinner"></span>
                                Signing in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>

                <div className="login-footer">
                    Employee & HR Management System
                </div>

            </div>

        </div>
    );
}

export default Login;