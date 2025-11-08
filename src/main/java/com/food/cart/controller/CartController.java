package com.food.cart.controller;

import com.food.cart.dto.AddToCartDTO;
import com.food.cart.dto.CartDTO;
import com.food.cart.model.User;
import com.food.cart.repository.UserRepository;
import com.food.cart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        CartDTO cart = cartService.getCart(user.getId());
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/add")
    public ResponseEntity<String> addItemToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToCartDTO dto) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.addItemToCart(user.getId(), dto);
        return ResponseEntity.ok("Item added to cart successfully");
    }
    
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeItemFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.removeItemFromCart(user.getId(), cartItemId);
        return ResponseEntity.ok("Item removed from cart successfully");
    }
}
