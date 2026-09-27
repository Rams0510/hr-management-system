import { useNavigate } from "react-router-dom";

function DashboardLayout({ children, title, welcome }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="app-shell">

            <header className="topbar">

                <div>
                    <div className="brand">
                        HRMS
                    </div>

                    <div className="brand-subtitle">
                        Employee Management System
                    </div>
                </div>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>

            </header>

            <main className="dashboard-container">

                <div className="dashboard-heading">
                    <div>
                        <h1>{title}</h1>
                        <p>{welcome}</p>
                    </div>
                </div>

                {children}

            </main>

        </div>
    );
}

export default DashboardLayout;