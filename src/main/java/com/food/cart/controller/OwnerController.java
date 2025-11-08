package com.food.cart.controller;

import com.food.cart.dto.*;
import com.food.cart.model.User;
import com.food.cart.repository.UserRepository;
import com.food.cart.service.MenuService;
import com.food.cart.service.OwnerOrderService;
import com.food.cart.service.OwnerStatisticsService;
import com.food.cart.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

        @Autowired
        private MenuService menuService;

        @Autowired
        private ShopService shopService;

        @Autowired
        private OwnerOrderService ownerOrderService;

        @Autowired
        private OwnerStatisticsService ownerStatisticsService;

        @Autowired
        private UserRepository userRepository;

        @PostMapping("/menu")
        public ResponseEntity<String> addMenuItem(
                        @AuthenticationPrincipal UserDetails userDetails,
                        @Valid @RequestBody MenuItemDTO dto) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                menuService.addMenuItem(user.getId(), dto);
                return new ResponseEntity<>("Menu item added successfully", HttpStatus.CREATED);
        }

        @PutMapping("/menu/{itemId}")
        public ResponseEntity<String> updateMenuItem(
                        @AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable Long itemId,
                        @Valid @RequestBody MenuItemDTO dto) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                menuService.updateMenuItem(user.getId(), itemId, dto);
                return ResponseEntity.ok("Menu item updated successfully");
        }

        @DeleteMapping("/menu/{itemId}")
        public ResponseEntity<String> deleteMenuItem(
                        @AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable Long itemId) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                menuService.deleteMenuItem(user.getId(), itemId);
                return ResponseEntity.ok("Menu item deleted successfully");
        }

        @GetMapping("/my-shop")
        public ResponseEntity<ShopDTO> getMyShop(@AuthenticationPrincipal UserDetails userDetails) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                ShopDTO shop = shopService.getOwnerShop(user.getId());
                return ResponseEntity.ok(shop);
        }

        @PutMapping("/my-shop")
        public ResponseEntity<String> updateShop(
                        @AuthenticationPrincipal UserDetails userDetails,
                        @Valid @RequestBody UpdateShopDTO dto) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                shopService.updateShop(user.getId(), dto);
                return ResponseEntity.ok("Shop updated successfully");
        }

        @GetMapping("/orders")
        public ResponseEntity<List<OrderDTO>> getShopOrders(@AuthenticationPrincipal UserDetails userDetails) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                List<OrderDTO> orders = ownerOrderService.getShopOrders(user.getId());
                return ResponseEntity.ok(orders);
        }

        @PutMapping("/orders/{orderId}/status")
        public ResponseEntity<String> updateOrderStatus(
                        @AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable Long orderId,
                        @Valid @RequestBody UpdateOrderStatusDTO dto) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                ownerOrderService.updateOrderStatus(user.getId(), orderId, dto.getStatus());
                return ResponseEntity.ok("Order status updated successfully");
        }

        @GetMapping("/statistics")
        public ResponseEntity<DashboardStatsDTO> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                DashboardStatsDTO stats = ownerStatisticsService.getDashboardStats(user.getId());
                return ResponseEntity.ok(stats);
        }
}
