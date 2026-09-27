package com.hrms.service;

import com.hrms.dto.LoginRequest;
import com.hrms.dto.LoginResponse;
import com.hrms.entity.User;
import com.hrms.repository.UserRepository;
import com.hrms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest req) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getUsername(),
                        req.getPassword()
                )
        );

        User user = userRepository
                .findByUsername(req.getUsername())
                .orElseThrow();

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        Long employeeId = null;
        String name = null;

        if (user.getEmployee() != null) {
            employeeId = user.getEmployee().getId();
            name = user.getEmployee().getName();
        }

        return new LoginResponse(
                token,
                user.getRole(),
                employeeId,
                name
        );
    }
}