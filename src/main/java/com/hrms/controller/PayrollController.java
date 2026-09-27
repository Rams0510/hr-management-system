package com.hrms.controller;

import com.hrms.entity.Payroll;
import com.hrms.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @PostMapping("/generate")
    public Payroll generate(
            @RequestParam Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {

        return payrollService.generate(employeeId, month, year);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Payroll> getByEmployee(@PathVariable Long employeeId) {
        return payrollService.getByEmployee(employeeId);
    }
}