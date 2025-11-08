package com.food.cart.controller;

import com.food.cart.dto.OrderDTO;
import com.food.cart.model.User;
import com.food.cart.repository.UserRepository;
import com.food.cart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        orderService.placeOrder(user.getId());
        return ResponseEntity.ok("Order placed successfully");
    }
    
    @GetMapping("/my-history")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<OrderDTO> orders = orderService.getOrderHistory(user.getId());
        return ResponseEntity.ok(orders);
    }
}
