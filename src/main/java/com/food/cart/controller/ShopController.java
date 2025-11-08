package com.food.cart.controller;

import com.food.cart.dto.MenuItemResponseDTO;
import com.food.cart.dto.ShopDTO;
import com.food.cart.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    
    @Autowired
    private ShopService shopService;
    
    @GetMapping
    public ResponseEntity<List<ShopDTO>> getAllShops() {
        List<ShopDTO> shops = shopService.getAllShops();
        return ResponseEntity.ok(shops);
    }
    
    @GetMapping("/{shopId}/menu")
    public ResponseEntity<List<MenuItemResponseDTO>> getShopMenu(@PathVariable Long shopId) {
        List<MenuItemResponseDTO> menu = shopService.getShopMenu(shopId);
        return ResponseEntity.ok(menu);
    }
}
