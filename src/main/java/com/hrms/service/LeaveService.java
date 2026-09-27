package com.hrms.service;

import com.hrms.dto.LeaveRequestDTO;
import com.hrms.entity.Employee;
import com.hrms.entity.LeaveBalance;
import com.hrms.entity.LeaveRequest;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveBalanceRepository;
import com.hrms.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRepo;

    @Autowired
    private LeaveBalanceRepository balanceRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    public LeaveRequest apply(LeaveRequestDTO dto) {

        LeaveRequest lr = new LeaveRequest();

        lr.setEmployee(
                employeeRepo.findById(dto.getEmployeeId()).orElseThrow()
        );

        lr.setLeaveType(dto.getLeaveType());
        lr.setStartDate(dto.getStartDate());
        lr.setEndDate(dto.getEndDate());
        lr.setStatus("PENDING");

        return leaveRepo.save(lr);
    }

    public List<LeaveRequest> getPending() {
        return leaveRepo.findByStatus("PENDING");
    }

    public List<LeaveRequest> getByEmployee(Long employeeId) {
        return leaveRepo.findByEmployeeId(employeeId);
    }

    @Transactional
    public LeaveRequest approve(Long id, Long approverId) {

        LeaveRequest lr = leaveRepo.findById(id).orElseThrow();

        lr.setStatus("APPROVED");
        lr.setApprovedBy(approverId);

        long days = ChronoUnit.DAYS.between(
                lr.getStartDate(),
                lr.getEndDate()
        ) + 1;

        LeaveBalance balance = balanceRepo
                .findByEmployeeIdAndLeaveType(
                        lr.getEmployee().getId(),
                        lr.getLeaveType()
                )
                .orElseThrow();

        balance.setUsed(
                balance.getUsed() + (int) days
        );

        balanceRepo.save(balance);

        return leaveRepo.save(lr);
    }

    public LeaveRequest reject(Long id, Long approverId) {

        LeaveRequest lr = leaveRepo.findById(id).orElseThrow();

        lr.setStatus("REJECTED");
        lr.setApprovedBy(approverId);

        return leaveRepo.save(lr);
    }
}