package com.food.cart.service;

import com.food.cart.dto.MenuItemResponseDTO;
import com.food.cart.dto.ShopDTO;
import com.food.cart.dto.UpdateShopDTO;
import com.food.cart.exception.ResourceNotFoundException;
import com.food.cart.model.MenuItem;
import com.food.cart.model.Shop;
import com.food.cart.repository.MenuItemRepository;
import com.food.cart.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<ShopDTO> getAllShops() {
        return shopRepository.findAll().stream()
                .map(this::convertToShopDTO)
                .collect(Collectors.toList());
    }

    public List<MenuItemResponseDTO> getShopMenu(Long shopId) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResourceNotFoundException("Shop not found with id: " + shopId);
        }

        return menuItemRepository.findByShopId(shopId).stream()
                .map(this::convertToMenuItemResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateShop(Long ownerId, UpdateShopDTO dto) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));

        shop.setShopName(dto.getShopName());
        shop.setDescription(dto.getDescription());
        shop.setAddress(dto.getAddress());

        // Update imageUrl if provided (can be null to keep existing image)
        if (dto.getImageUrl() != null) {
            shop.setImageUrl(dto.getImageUrl());
        }

        shopRepository.save(shop);
    }

    public ShopDTO getOwnerShop(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));
        return convertToShopDTO(shop);
    }

    private ShopDTO convertToShopDTO(Shop shop) {
        return new ShopDTO(
                shop.getId(),
                shop.getShopName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getImageUrl());
    }

    private MenuItemResponseDTO convertToMenuItemResponseDTO(MenuItem item) {
        return new MenuItemResponseDTO(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getImageUrl());
    }
}
