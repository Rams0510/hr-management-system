package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.entity.Payroll;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveRequestRepository;
import com.hrms.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private LeaveRequestRepository leaveRepo;

    public List<Payroll> getByEmployee(Long employeeId) {
        return payrollRepo.findByEmployeeId(employeeId);
    }

    public Payroll generate(Long employeeId, int month, int year) {

        Employee emp = employeeRepo
                .findById(employeeId)
                .orElseThrow();

        double perDayPay = emp.getBasicSalary() / 30;

        long unpaidDays = leaveRepo
                .findByEmployeeId(employeeId)
                .stream()
                .filter(l ->
                        l.getStatus().equals("APPROVED")
                                && l.getLeaveType().equals("UNPAID")
                )
                .mapToLong(l ->
                        ChronoUnit.DAYS.between(
                                l.getStartDate(),
                                l.getEndDate()
                        ) + 1
                )
                .sum();

        double deductions = unpaidDays * perDayPay;

        double netPay = emp.getBasicSalary() - deductions;

        Payroll p = new Payroll();

        p.setEmployee(emp);
        p.setMonth(month);
        p.setYear(year);
        p.setGrossPay(emp.getBasicSalary());
        p.setDeductions(deductions);
        p.setNetPay(netPay);

        return payrollRepo.save(p);
    }
}