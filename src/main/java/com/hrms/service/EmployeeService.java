package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id).orElseThrow();
    }

    public Employee create(Employee e) {
        return employeeRepository.save(e);
    }

    public Employee update(Long id, Employee e) {
        e.setId(id);
        return employeeRepository.save(e);
    }

    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }
}