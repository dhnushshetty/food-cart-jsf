package com.food.cart.controller;

import com.food.cart.dto.LoginDTO;
import com.food.cart.dto.LoginResponseDTO;
import com.food.cart.dto.RegisterDTO;
import com.food.cart.dto.RegisterOwnerDTO;
import com.food.cart.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register/customer")
    public ResponseEntity<String> registerCustomer(@Valid @RequestBody RegisterDTO dto) {
        authService.registerCustomer(dto);
        return new ResponseEntity<>("Customer registered successfully", HttpStatus.CREATED);
    }
    
    @PostMapping("/register/owner")
    public ResponseEntity<String> registerOwner(@Valid @RequestBody RegisterOwnerDTO dto) {
        authService.registerOwner(dto);
        return new ResponseEntity<>("Owner registered successfully", HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginDTO dto) {
        LoginResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}
