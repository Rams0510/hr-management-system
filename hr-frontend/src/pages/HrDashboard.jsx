import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FeatureCard from "../components/FeatureCard";
import api from "../api/axios";

function HrDashboard() {

    const role = localStorage.getItem("role");

    const [activeFeature, setActiveFeature] = useState(null);

    const [employees, setEmployees] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeLeaves, setEmployeeLeaves] = useState([]);
    const [employeePayroll, setEmployeePayroll] = useState([]);

    const [searchId, setSearchId] = useState("");

    const [editingEmployee, setEditingEmployee] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        designation: "",
        joiningDate: "",
        basicSalary: ""
    });

    const [payrollForm, setPayrollForm] = useState({
        employeeId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    const [generatedPayroll, setGeneratedPayroll] = useState(null);

    useEffect(() => {
        loadEmployees();
        loadPendingLeaves();
    }, []);

    const loadEmployees = async () => {

        try {

            const response = await api.get("/employees");

            setEmployees(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const loadPendingLeaves = async () => {

        try {

            const response = await api.get("/leaves/pending");

            setPendingLeaves(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const openFeature = async (feature) => {

        setActiveFeature(feature);

        if (feature === "employees") {
            await loadEmployees();
        }

        if (feature === "leaves") {
            await loadPendingLeaves();
        }
    };

    const showEmployeeDetails = async () => {

        if (!searchId) {
            alert("Enter Employee ID.");
            return;
        }

        try {

            const employeeResponse = await api.get(
                `/employees/${searchId}`
            );

            const leaveResponse = await api.get(
                `/leaves/employee/${searchId}`
            );

            const payrollResponse = await api.get(
                `/payroll/employee/${searchId}`
            );

            setSelectedEmployee(employeeResponse.data);
            setEmployeeLeaves(leaveResponse.data);
            setEmployeePayroll(payrollResponse.data);

        } catch (error) {

            console.error(error);
            alert("Employee not found.");

        }
    };

    const approveLeave = async (id) => {

        try {

            const approverId =
                localStorage.getItem("employeeId");

            await api.put(
                `/leaves/approve/${id}?approverId=${approverId}`
            );

            alert("Leave approved.");

            await loadPendingLeaves();

        } catch (error) {

            console.error(error);
            alert("Failed to approve leave.");

        }
    };

    const rejectLeave = async (id) => {

        try {

            const approverId =
                localStorage.getItem("employeeId");

            await api.put(
                `/leaves/reject/${id}?approverId=${approverId}`
            );

            alert("Leave rejected.");

            await loadPendingLeaves();

        } catch (error) {

            console.error(error);
            alert("Failed to reject leave.");

        }
    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const startAdd = () => {

        setEditingEmployee(null);

        setForm({
            name: "",
            email: "",
            designation: "",
            joiningDate: "",
            basicSalary: ""
        });
    };

    const startEdit = (employee) => {

        setEditingEmployee(employee);

        setForm({
            name: employee.name || "",
            email: employee.email || "",
            designation: employee.designation || "",
            joiningDate: employee.joiningDate || "",
            basicSalary: employee.basicSalary || ""
        });
    };

    const saveEmployee = async (e) => {

        e.preventDefault();

        try {

            const data = {
                name: form.name,
                email: form.email,
                designation: form.designation,
                joiningDate: form.joiningDate,
                basicSalary: Number(form.basicSalary)
            };

            if (editingEmployee) {

                await api.put(
                    `/employees/${editingEmployee.id}`,
                    data
                );

                alert("Employee updated.");

            } else {

                await api.post(
                    "/employees",
                    data
                );

                alert("Employee added.");
            }

            setEditingEmployee(null);

            setForm({
                name: "",
                email: "",
                designation: "",
                joiningDate: "",
                basicSalary: ""
            });

            await loadEmployees();

        } catch (error) {

            console.error(error);
            alert("Failed to save employee.");

        }
    };

    const deleteEmployee = async (id) => {

        if (!window.confirm(
            "Are you sure you want to delete this employee?"
        )) {
            return;
        }

        try {

            await api.delete(`/employees/${id}`);

            alert("Employee deleted.");

            await loadEmployees();

        } catch (error) {

            console.error(error);
            alert("Failed to delete employee.");
        }
    };

    const generatePayroll = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                `/payroll/generate?employeeId=${payrollForm.employeeId}&month=${payrollForm.month}&year=${payrollForm.year}`
            );

            setGeneratedPayroll(response.data);

            alert("Payroll generated.");

        } catch (error) {

            console.error(error);
            alert("Failed to generate payroll.");

        }
    };

    const backToDashboard = () => {
        setActiveFeature(null);
    };

    return (
        <DashboardLayout
            title="HR Dashboard"
            welcome={`Welcome, HR (${role})`}
        >

            {!activeFeature && (
                <div className="feature-grid">

                    <FeatureCard
                        icon="✅"
                        title="Approve / Reject Leave"
                        description="Review employee leave requests."
                        onClick={() => openFeature("leaves")}
                    />

                    <FeatureCard
                        icon="👥"
                        title="Manage Employees"
                        description="Add, edit and delete employees."
                        onClick={() => openFeature("employees")}
                    />

                    <FeatureCard
                        icon="🔎"
                        title="Employee Lookup"
                        description="Search employee details and history."
                        onClick={() => openFeature("lookup")}
                    />

                    <FeatureCard
                        icon="💰"
                        title="Generate Payroll"
                        description="Generate monthly employee payroll."
                        onClick={() => openFeature("payroll")}
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

                    {activeFeature === "leaves" && (
                        <LeaveApproval
                            leaves={pendingLeaves}
                            approveLeave={approveLeave}
                            rejectLeave={rejectLeave}
                        />
                    )}

                    {activeFeature === "employees" && (
                        <EmployeeManagement
                            employees={employees}
                            form={form}
                            editingEmployee={editingEmployee}
                            handleChange={handleChange}
                            startAdd={startAdd}
                            startEdit={startEdit}
                            saveEmployee={saveEmployee}
                            deleteEmployee={deleteEmployee}
                            cancelEdit={() => {
                                setEditingEmployee(null);
                                setForm({
                                    name: "",
                                    email: "",
                                    designation: "",
                                    joiningDate: "",
                                    basicSalary: ""
                                });
                            }}
                        />
                    )}

                    {activeFeature === "lookup" && (
                        <EmployeeLookup
                            searchId={searchId}
                            setSearchId={setSearchId}
                            showEmployeeDetails={showEmployeeDetails}
                            employee={selectedEmployee}
                            leaves={employeeLeaves}
                            payroll={employeePayroll}
                        />
                    )}

                    {activeFeature === "payroll" && (
                        <PayrollGenerator
                            form={payrollForm}
                            setForm={setPayrollForm}
                            generatePayroll={generatePayroll}
                            result={generatedPayroll}
                        />
                    )}

                </div>
            )}

        </DashboardLayout>
    );
}

function LeaveApproval({
                           leaves,
                           approveLeave,
                           rejectLeave
                       }) {

    return (
        <div>

            <div className="panel-header">
                <span>✅</span>

                <div>
                    <h2>Leave Requests</h2>
                    <p>
                        Review pending employee leave requests.
                    </p>
                </div>
            </div>

            {leaves.length === 0 ? (
                <div className="empty-state">
                    No pending leave requests.
                </div>
            ) : (
                <div className="table-wrapper">

                    <table className="data-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>

                        {leaves.map((leave) => (
                            <tr key={leave.id}>

                                <td>{leave.id}</td>

                                <td>
                                    {leave.employee?.name || "Employee"}
                                </td>

                                <td>
                                    {leave.leaveType}
                                </td>

                                <td>
                                    {leave.startDate}
                                </td>

                                <td>
                                    {leave.endDate}
                                </td>

                                <td className="action-buttons">

                                    <button
                                        className="approve-btn"
                                        onClick={() =>
                                            approveLeave(leave.id)
                                        }
                                    >
                                        Approve
                                    </button>

                                    <button
                                        className="reject-btn"
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

                </div>
            )}

        </div>
    );
}

function EmployeeManagement({
                                employees,
                                form,
                                editingEmployee,
                                handleChange,
                                startAdd,
                                startEdit,
                                saveEmployee,
                                deleteEmployee,
                                cancelEdit
                            }) {

    return (
        <div>

            <div className="panel-header">

                <span>👥</span>

                <div>
                    <h2>Manage Employees</h2>
                    <p>
                        Add, edit and remove employees.
                    </p>
                </div>

            </div>

            <button
                className="primary-btn"
                onClick={startAdd}
            >
                + Add Employee
            </button>

            <div className="employee-form">

                <h3>
                    {editingEmployee
                        ? "Edit Employee"
                        : "Add Employee"}
                </h3>

                <form onSubmit={saveEmployee}>

                    <div className="form-grid">

                        <div className="input-group">
                            <label>Name</label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Employee name"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Designation</label>

                            <input
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                placeholder="Designation"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Joining Date</label>

                            <input
                                type="date"
                                name="joiningDate"
                                value={form.joiningDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Basic Salary</label>

                            <input
                                type="number"
                                name="basicSalary"
                                value={form.basicSalary}
                                onChange={handleChange}
                                placeholder="Basic salary"
                                required
                            />
                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            className="primary-btn"
                            type="submit"
                        >
                            {editingEmployee
                                ? "Update Employee"
                                : "Save Employee"}
                        </button>

                        {editingEmployee && (
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            <div className="section-divider"></div>

            <h3>Employees</h3>

            <div className="table-wrapper">

                <table className="data-table">

                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Salary</th>
                        <th>Actions</th>
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
                            <td>
                                ₹{Number(
                                employee.basicSalary
                            ).toLocaleString()}
                            </td>

                            <td className="action-buttons">

                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        startEdit(employee)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="reject-btn"
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

            </div>

        </div>
    );
}

function EmployeeLookup({
                            searchId,
                            setSearchId,
                            showEmployeeDetails,
                            employee,
                            leaves,
                            payroll
                        }) {

    return (
        <div>

            <div className="panel-header">

                <span>🔎</span>

                <div>
                    <h2>Employee Lookup</h2>
                    <p>
                        Search by employee ID.
                    </p>
                </div>

            </div>

            <div className="lookup-bar">

                <input
                    type="number"
                    placeholder="Enter Employee ID"
                    value={searchId}
                    onChange={(e) =>
                        setSearchId(e.target.value)
                    }
                />

                <button
                    className="primary-btn"
                    onClick={showEmployeeDetails}
                >
                    Search Employee
                </button>

            </div>

            {employee && (
                <div className="lookup-result">

                    <div className="employee-profile">

                        <div className="avatar">
                            {employee.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2>{employee.name}</h2>
                            <p>{employee.designation}</p>
                        </div>

                    </div>

                    <div className="details-grid">

                        <div>
                            <span>ID</span>
                            <strong>{employee.id}</strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>{employee.email}</strong>
                        </div>

                        <div>
                            <span>Joining Date</span>
                            <strong>{employee.joiningDate}</strong>
                        </div>

                        <div>
                            <span>Basic Salary</span>
                            <strong>
                                ₹{Number(
                                employee.basicSalary
                            ).toLocaleString()}
                            </strong>
                        </div>

                    </div>

                    <div className="section-divider"></div>

                    <h3>Leave History</h3>

                    <SimpleLeaveTable leaves={leaves} />

                    <div className="section-divider"></div>

                    <h3>Payroll History</h3>

                    <SimplePayrollTable payroll={payroll} />

                </div>
            )}

        </div>
    );
}

function SimpleLeaveTable({ leaves }) {

    if (!leaves.length) {
        return (
            <div className="empty-state">
                No leave records.
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
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>

                {leaves.map((leave) => (
                    <tr key={leave.id}>
                        <td>{leave.id}</td>
                        <td>{leave.leaveType}</td>
                        <td>{leave.startDate}</td>
                        <td>{leave.endDate}</td>
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

function SimplePayrollTable({ payroll }) {

    if (!payroll.length) {
        return (
            <div className="empty-state">
                No payroll records.
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
                    <th>Gross</th>
                    <th>Deductions</th>
                    <th>Net</th>
                </tr>
                </thead>

                <tbody>

                {payroll.map((item) => (
                    <tr key={item.id}>
                        <td>{item.month}</td>
                        <td>{item.year}</td>
                        <td>₹{item.grossPay}</td>
                        <td>₹{item.deductions}</td>
                        <td>₹{item.netPay}</td>
                    </tr>
                ))}

                </tbody>

            </table>

        </div>
    );
}

function PayrollGenerator({
                              form,
                              setForm,
                              generatePayroll,
                              result
                          }) {

    return (
        <div>

            <div className="panel-header">

                <span>💰</span>

                <div>
                    <h2>Generate Payroll</h2>
                    <p>
                        Generate monthly payroll for an employee.
                    </p>
                </div>

            </div>

            <form
                className="payroll-form"
                onSubmit={generatePayroll}
            >

                <div className="form-grid">

                    <div className="input-group">
                        <label>Employee ID</label>

                        <input
                            type="number"
                            value={form.employeeId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    employeeId: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Month</label>

                        <select
                            value={form.month}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    month: Number(e.target.value)
                                })
                            }
                        >
                            {Array.from(
                                { length: 12 },
                                (_, index) => (
                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {index + 1}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Year</label>

                        <input
                            type="number"
                            value={form.year}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    year: Number(e.target.value)
                                })
                            }
                            required
                        />
                    </div>

                </div>

                <button
                    className="primary-btn"
                    type="submit"
                >
                    Generate Payroll
                </button>

            </form>

            {result && (
                <div className="payroll-result">

                    <div className="result-header">
                        Payroll Generated
                    </div>

                    <div className="result-grid">

                        <div>
                            <span>Employee</span>
                            <strong>
                                {result.employee?.name}
                            </strong>
                        </div>

                        <div>
                            <span>Month</span>
                            <strong>{result.month}</strong>
                        </div>

                        <div>
                            <span>Year</span>
                            <strong>{result.year}</strong>
                        </div>

                        <div>
                            <span>Gross Pay</span>
                            <strong>
                                ₹{result.grossPay}
                            </strong>
                        </div>

                        <div>
                            <span>Deductions</span>
                            <strong>
                                ₹{result.deductions}
                            </strong>
                        </div>

                        <div>
                            <span>Net Pay</span>
                            <strong className="net-pay">
                                ₹{result.netPay}
                            </strong>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default HrDashboard;