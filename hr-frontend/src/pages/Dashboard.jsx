import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [designation, setDesignation] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [basicSalary, setBasicSalary] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [leaveEmployeeId, setLeaveEmployeeId] = useState("");
    const [leaveType, setLeaveType] = useState("CASUAL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [payrollEmployeeId, setPayrollEmployeeId] = useState("");
    const [payrollMonth, setPayrollMonth] = useState("");
    const [payrollYear, setPayrollYear] = useState("");
    const [payroll, setPayroll] = useState(null);

    const role = localStorage.getItem("role");

    useEffect(() => {
        loadEmployees();
        loadPendingLeaves();
    }, []);

    const loadEmployees = async () => {
        try {
            const res = await api.get("/employees");
            setEmployees(res.data);
        } catch (error) {
            console.error("Failed to load employees", error);
        } finally {
            setLoading(false);
        }
    };

    const loadPendingLeaves = async () => {
        try {
            const res = await api.get("/leaves/pending");
            setLeaves(res.data);
        } catch (error) {
            console.error("Failed to load pending leaves", error);
        }
    };

    const saveEmployee = async (e) => {
        e.preventDefault();

        const employeeData = {
            name,
            email,
            designation,
            joiningDate,
            basicSalary: Number(basicSalary)
        };

        try {
            if (editingId) {
                await api.put(`/employees/${editingId}`, employeeData);
                alert("Employee updated successfully!");
            } else {
                await api.post("/employees", employeeData);
                alert("Employee added successfully!");
            }

            clearEmployeeForm();
            loadEmployees();
        } catch (error) {
            console.error("Failed to save employee", error);
            alert("Failed to save employee");
        }
    };

    const editEmployee = (employee) => {
        setEditingId(employee.id);
        setName(employee.name);
        setEmail(employee.email);
        setDesignation(employee.designation);
        setJoiningDate(employee.joiningDate);
        setBasicSalary(employee.basicSalary);
    };

    const deleteEmployee = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/employees/${id}`);
            alert("Employee deleted successfully!");
            clearEmployeeForm();
            loadEmployees();
        } catch (error) {
            console.error("Failed to delete employee", error);
            alert("Failed to delete employee");
        }
    };

    const clearEmployeeForm = () => {
        setEditingId(null);
        setName("");
        setEmail("");
        setDesignation("");
        setJoiningDate("");
        setBasicSalary("");
    };

    const applyLeave = async (e) => {
        e.preventDefault();

        try {
            await api.post("/leaves/apply", {
                employeeId: Number(leaveEmployeeId),
                leaveType,
                startDate,
                endDate
            });

            alert("Leave applied successfully!");

            setLeaveEmployeeId("");
            setLeaveType("CASUAL");
            setStartDate("");
            setEndDate("");

            loadPendingLeaves();
        } catch (error) {
            console.error("Failed to apply leave", error);
            alert("Failed to apply leave");
        }
    };

    const approveLeave = async (id) => {
        try {
            await api.put(`/leaves/approve/${id}?approverId=1`);
            alert("Leave approved successfully!");
            loadPendingLeaves();
        } catch (error) {
            console.error("Failed to approve leave", error);
            alert("Failed to approve leave");
        }
    };

    const rejectLeave = async (id) => {
        try {
            await api.put(`/leaves/reject/${id}?approverId=1`);
            alert("Leave rejected successfully!");
            loadPendingLeaves();
        } catch (error) {
            console.error("Failed to reject leave", error);
            alert("Failed to reject leave");
        }
    };

    const generatePayroll = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                `/payroll/generate?employeeId=${payrollEmployeeId}&month=${payrollMonth}&year=${payrollYear}`
            );

            setPayroll(res.data);

            alert("Payroll generated successfully!");
        } catch (error) {
            console.error("Failed to generate payroll", error);
            alert("Failed to generate payroll");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <div>
            <h1>HRMS Dashboard</h1>

            <p>Welcome ({role})</p>

            <button onClick={logout}>Logout</button>

            <hr />

            <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

            <form onSubmit={saveEmployee}>
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="date"
                        value={joiningDate}
                        onChange={(e) => setJoiningDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Basic Salary"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">
                    {editingId ? "Update Employee" : "Add Employee"}
                </button>

                {editingId && (
                    <button type="button" onClick={clearEmployeeForm}>
                        Cancel
                    </button>
                )}
            </form>

            <hr />

            <h2>Employees</h2>

            {loading ? (
                <p>Loading employees...</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Salary</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.designation}</td>
                            <td>{employee.joiningDate}</td>
                            <td>{employee.basicSalary}</td>
                            <td>
                                <button
                                    onClick={() => editEmployee(employee)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteEmployee(employee.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <hr />

            <h2>Apply Leave</h2>

            <form onSubmit={applyLeave}>
                <div>
                    <input
                        type="number"
                        placeholder="Employee ID"
                        value={leaveEmployeeId}
                        onChange={(e) => setLeaveEmployeeId(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                    >
                        <option value="CASUAL">CASUAL</option>
                        <option value="SICK">SICK</option>
                        <option value="UNPAID">UNPAID</option>
                    </select>
                </div>

                <div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Apply Leave</button>
            </form>

            <hr />

            <h2>Pending Leave Requests</h2>

            {leaves.length === 0 ? (
                <p>No pending leave requests.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {leaves.map((leave) => (
                        <tr key={leave.id}>
                            <td>{leave.id}</td>
                            <td>{leave.employee.name}</td>
                            <td>{leave.leaveType}</td>
                            <td>{leave.startDate}</td>
                            <td>{leave.endDate}</td>
                            <td>{leave.status}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        approveLeave(leave.id)
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() =>
                                        rejectLeave(leave.id)
                                    }
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <hr />

            <h2>Generate Payroll</h2>

            <form onSubmit={generatePayroll}>
                <div>
                    <input
                        type="number"
                        placeholder="Employee ID"
                        value={payrollEmployeeId}
                        onChange={(e) =>
                            setPayrollEmployeeId(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Month"
                        min="1"
                        max="12"
                        value={payrollMonth}
                        onChange={(e) =>
                            setPayrollMonth(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Year"
                        value={payrollYear}
                        onChange={(e) =>
                            setPayrollYear(e.target.value)
                        }
                        required
                    />
                </div>

                <button type="submit">
                    Generate Payroll
                </button>
            </form>

            {payroll && (
                <div>
                    <h2>Payroll Result</h2>

                    <p>
                        Employee: {payroll.employee.name}
                    </p>

                    <p>
                        Month: {payroll.month}
                    </p>

                    <p>
                        Year: {payroll.year}
                    </p>

                    <p>
                        Gross Pay: {payroll.grossPay}
                    </p>

                    <p>
                        Deductions: {payroll.deductions}
                    </p>

                    <p>
                        Net Pay: {payroll.netPay}
                    </p>

                    <p>
                        Generated On: {payroll.generatedOn}
                    </p>
                </div>
            )}
        </div>
    );
}