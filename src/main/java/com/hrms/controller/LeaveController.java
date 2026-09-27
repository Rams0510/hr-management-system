package com.hrms.controller;

import com.hrms.dto.LeaveRequestDTO;
import com.hrms.entity.LeaveRequest;
import com.hrms.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping("/apply")
    public LeaveRequest apply(@RequestBody LeaveRequestDTO dto) {
        return leaveService.apply(dto);
    }

    @GetMapping("/pending")
    public List<LeaveRequest> pending() {
        return leaveService.getPending();
    }

    @GetMapping("/employee/{id}")
    public List<LeaveRequest> byEmployee(@PathVariable Long id) {
        return leaveService.getByEmployee(id);
    }

    @PutMapping("/approve/{id}")
    public LeaveRequest approve(
            @PathVariable Long id,
            @RequestParam Long approverId) {
        return leaveService.approve(id, approverId);
    }

    @PutMapping("/reject/{id}")
    public LeaveRequest reject(
            @PathVariable Long id,
            @RequestParam Long approverId) {
        return leaveService.reject(id, approverId);
    }
}