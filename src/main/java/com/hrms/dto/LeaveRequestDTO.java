package com.hrms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestDTO {

    private Long employeeId;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
}