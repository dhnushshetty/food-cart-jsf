package com.food.cart.service;

import com.food.cart.dto.MenuItemDTO;
import com.food.cart.exception.ForbiddenException;
import com.food.cart.exception.ResourceNotFoundException;
import com.food.cart.model.MenuItem;
import com.food.cart.model.Shop;
import com.food.cart.repository.MenuItemRepository;
import com.food.cart.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MenuService {
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private ShopRepository shopRepository;
    
    @Transactional
    public void addMenuItem(Long ownerId, MenuItemDTO dto) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));
        
        MenuItem menuItem = new MenuItem();
        menuItem.setShopId(shop.getId());
        menuItem.setName(dto.getName());
        menuItem.setDescription(dto.getDescription());
        menuItem.setPrice(dto.getPrice());
        menuItem.setImageUrl(dto.getImageUrl());
        menuItemRepository.save(menuItem);
    }
    
    @Transactional
    public void updateMenuItem(Long ownerId, Long itemId, MenuItemDTO dto) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));
        
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        
        if (!menuItem.getShopId().equals(shop.getId())) {
            throw new ForbiddenException("You can only update menu items from your own shop");
        }
        
        menuItem.setName(dto.getName());
        menuItem.setDescription(dto.getDescription());
        menuItem.setPrice(dto.getPrice());
        menuItem.setImageUrl(dto.getImageUrl());
        menuItemRepository.save(menuItem);
    }
    
    @Transactional
    public void deleteMenuItem(Long ownerId, Long itemId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));
        
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        
        if (!menuItem.getShopId().equals(shop.getId())) {
            throw new ForbiddenException("You can only delete menu items from your own shop");
        }
        
        menuItemRepository.delete(menuItem);
    }
}
