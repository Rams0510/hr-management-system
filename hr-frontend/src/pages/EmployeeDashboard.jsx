import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FeatureCard from "../components/FeatureCard";
import api from "../api/axios";

function EmployeeDashboard() {

    const employeeId = localStorage.getItem("employeeId");
    const storedName = localStorage.getItem("name");

    const [employee, setEmployee] = useState(null);

    const [leaves, setLeaves] = useState([]);
    const [payroll, setPayroll] = useState([]);

    const [activeFeature, setActiveFeature] = useState(null);

    const [leaveType, setLeaveType] = useState("CASUAL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadEmployee();
    }, []);

    const loadEmployee = async () => {
        try {
            if (!employeeId) return;

            const response = await api.get(
                `/employees/${employeeId}`
            );

            setEmployee(response.data);

            if (response.data.name) {
                localStorage.setItem(
                    "name",
                    response.data.name
                );
            }

        } catch (error) {
            console.error(error);
        }
    };

    const loadLeaves = async () => {
        try {
            const response = await api.get(
                `/leaves/employee/${employeeId}`
            );

            setLeaves(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const loadPayroll = async () => {
        try {
            const response = await api.get(
                `/payroll/employee/${employeeId}`
            );

            setPayroll(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const openFeature = async (feature) => {

        setActiveFeature(feature);

        if (feature === "leave") {
            await loadLeaves();
        }

        if (feature === "payroll") {
            await loadPayroll();
        }

        if (feature === "history") {
            await loadLeaves();
            await loadPayroll();
        }
    };

    const applyLeave = async (e) => {

        e.preventDefault();

        if (!startDate || !endDate) {
            alert("Please select both dates.");
            return;
        }

        if (startDate > endDate) {
            alert("End date cannot be before start date.");
            return;
        }

        try {

            setSubmitting(true);

            await api.post("/leaves/apply", {
                employeeId: Number(employeeId),
                leaveType,
                startDate,
                endDate
            });

            alert("Leave applied successfully.");

            setLeaveType("CASUAL");
            setStartDate("");
            setEndDate("");

            await loadLeaves();

        } catch (error) {

            console.error(error);
            alert("Failed to apply leave.");

        } finally {
            setSubmitting(false);
        }
    };

    const backToDashboard = () => {
        setActiveFeature(null);
    };

    const displayName =
        employee?.name ||
        storedName ||
        "Employee";

    return (
        <DashboardLayout
            title="Employee Dashboard"
            welcome={`Welcome, ${displayName}`}
        >

            {!activeFeature && (
                <div className="feature-grid">

                    <FeatureCard
                        icon="📝"
                        title="Apply Leave"
                        description="Submit a new leave request."
                        onClick={() => openFeature("leave")}
                    />

                    <FeatureCard
                        icon="💰"
                        title="My Payroll"
                        description="View your salary and payroll records."
                        onClick={() => openFeature("payroll")}
                    />

                    <FeatureCard
                        icon="📊"
                        title="Leave & Payroll History"
                        description="View your complete employment history."
                        onClick={() => openFeature("history")}
                    />

                </div>
            )}

            {activeFeature && (
                <div className="feature-panel">

                    <button
                        className="back-btn"
                        onClick={backToDashboard}
                    >
                        ← Back to Dashboard
                    </button>

                    {activeFeature === "leave" && (
                        <div>

                            <div className="panel-header">
                                <span>📝</span>
                                <div>
                                    <h2>Apply Leave</h2>
                                    <p>
                                        Submit your leave request.
                                    </p>
                                </div>
                            </div>

                            <form
                                className="leave-form"
                                onSubmit={applyLeave}
                            >

                                <div className="input-group">
                                    <label>Leave Type</label>

                                    <select
                                        value={leaveType}
                                        onChange={(e) =>
                                            setLeaveType(e.target.value)
                                        }
                                    >
                                        <option value="CASUAL">
                                            Casual Leave
                                        </option>

                                        <option value="SICK">
                                            Sick Leave
                                        </option>

                                        <option value="UNPAID">
                                            Unpaid Leave
                                        </option>
                                    </select>
                                </div>

                                <div className="form-row">

                                    <div className="input-group">
                                        <label>Start Date</label>

                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>End Date</label>

                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                        />
                                    </div>

                                </div>

                                <button
                                    className="primary-btn"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Leave Request"}
                                </button>

                            </form>

                            <div className="section-divider"></div>

                            <h3>Recent Leave Requests</h3>

                            <LeaveTable leaves={leaves} />

                        </div>
                    )}

                    {activeFeature === "payroll" && (
                        <div>

                            <div className="panel-header">
                                <span>💰</span>
                                <div>
                                    <h2>My Payroll</h2>
                                    <p>
                                        View your salary and payroll records.
                                    </p>
                                </div>
                            </div>

                            <PayrollTable payroll={payroll} />

                        </div>
                    )}

                    {activeFeature === "history" && (
                        <div>

                            <div className="panel-header">
                                <span>📊</span>
                                <div>
                                    <h2>Leave & Payroll History</h2>
                                    <p>
                                        Your complete history.
                                    </p>
                                </div>
                            </div>

                            <h3>Leave History</h3>

                            <LeaveTable leaves={leaves} />

                            <div className="section-divider"></div>

                            <h3>Payroll History</h3>

                            <PayrollTable payroll={payroll} />

                        </div>
                    )}

                </div>
            )}

        </DashboardLayout>
    );
}

function LeaveTable({ leaves }) {

    if (!leaves || leaves.length === 0) {
        return (
            <div className="empty-state">
                No leave records found.
            </div>
        );
    }

    return (
        <div className="table-wrapper">

            <table className="data-table">

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>

                {leaves.map((leave) => (
                    <tr key={leave.id}>

                        <td>{leave.id}</td>

                        <td>
                            {leave.leaveType}
                        </td>

                        <td>
                            {leave.startDate}
                        </td>

                        <td>
                            {leave.endDate}
                        </td>

                        <td>
                            <span
                                className={`status status-${leave.status?.toLowerCase()}`}
                            >
                                {leave.status}
                            </span>
                        </td>

                    </tr>
                ))}

                </tbody>

            </table>

        </div>
    );
}

function PayrollTable({ payroll }) {

    if (!payroll || payroll.length === 0) {
        return (
            <div className="empty-state">
                No payroll records found.
            </div>
        );
    }

    return (
        <div className="table-wrapper">

            <table className="data-table">

                <thead>
                <tr>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Gross Pay</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                </tr>
                </thead>

                <tbody>

                {payroll.map((item) => (
                    <tr key={item.id}>

                        <td>{item.month}</td>
                        <td>{item.year}</td>

                        <td>
                            ₹{Number(item.grossPay).toLocaleString()}
                        </td>

                        <td>
                            ₹{Number(item.deductions).toLocaleString()}
                        </td>

                        <td className="net-pay">
                            ₹{Number(item.netPay).toLocaleString()}
                        </td>

                    </tr>
                ))}

                </tbody>

            </table>

        </div>
    );
}

export default EmployeeDashboard;