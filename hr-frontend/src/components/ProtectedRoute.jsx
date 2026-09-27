import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === "EMPLOYEE") {
            return <Navigate to="/employee" replace />;
        }

        return <Navigate to="/hr" replace />;
    }

    return children;
}

export default ProtectedRoute;