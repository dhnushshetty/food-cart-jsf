package com.food.cart.service;

import com.food.cart.dto.LoginDTO;
import com.food.cart.dto.LoginResponseDTO;
import com.food.cart.dto.RegisterDTO;
import com.food.cart.dto.RegisterOwnerDTO;
import com.food.cart.exception.UnauthorizedException;
import com.food.cart.model.*;
import com.food.cart.repository.CartRepository;
import com.food.cart.repository.ShopRepository;
import com.food.cart.repository.UserRepository;
import com.food.cart.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ShopRepository shopRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Transactional
    public void registerCustomer(RegisterDTO dto) {
        // Create user with ROLE_CUSTOMER
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.ROLE_CUSTOMER);
        user = userRepository.save(user);
        
        // Create empty cart for customer
        Cart cart = new Cart();
        cart.setUserId(user.getId());
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }
    
    @Transactional
    public void registerOwner(RegisterOwnerDTO dto) {
        // Create user with ROLE_OWNER
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.ROLE_OWNER);
        user = userRepository.save(user);
        
        // Create shop for owner
        Shop shop = new Shop();
        shop.setOwnerId(user.getId());
        shop.setShopName(dto.getShopName());
        shop.setDescription(dto.getDescription());
        shop.setAddress(dto.getAddress());
        shopRepository.save(shop);
    }
    
    public LoginResponseDTO login(LoginDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));
        
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        
        return new LoginResponseDTO(token, user.getUsername(), user.getRole().name());
    }
}
