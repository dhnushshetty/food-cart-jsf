package com.food.cart.service;

import com.food.cart.dto.DashboardStatsDTO;
import com.food.cart.dto.TopItemDTO;
import com.food.cart.exception.ResourceNotFoundException;
import com.food.cart.model.MenuItem;
import com.food.cart.model.Shop;
import com.food.cart.repository.MenuItemRepository;
import com.food.cart.repository.OrderRepository;
import com.food.cart.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OwnerStatisticsService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ShopRepository shopRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    public DashboardStatsDTO getDashboardStats(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));
        
        Long shopId = shop.getId();
        
        // Calculate total revenue
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue(shopId);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        
        // Count pending orders
        Long pendingOrdersCount = orderRepository.countPendingOrders(shopId);
        if (pendingOrdersCount == null) {
            pendingOrdersCount = 0L;
        }
        
        // Get top selling items
        List<Object[]> topSellingData = orderRepository.findTopSellingItems(shopId);
        List<TopItemDTO> topSellingItems = new ArrayList<>();
        
        for (Object[] data : topSellingData) {
            Long menuItemId = ((Number) data[0]).longValue();
            Long totalQuantity = ((Number) data[1]).longValue();
            
            MenuItem menuItem = menuItemRepository.findById(menuItemId)
                    .orElse(null);
            
            if (menuItem != null) {
                topSellingItems.add(new TopItemDTO(
                        menuItemId,
                        menuItem.getName(),
                        totalQuantity
                ));
            }
        }
        
        return new DashboardStatsDTO(totalRevenue, pendingOrdersCount, topSellingItems);
    }
}
