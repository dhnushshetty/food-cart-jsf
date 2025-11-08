package com.food.cart.service;

import com.food.cart.dto.OrderDTO;
import com.food.cart.dto.OrderItemDTO;
import com.food.cart.exception.ForbiddenException;
import com.food.cart.exception.ResourceNotFoundException;
import com.food.cart.model.*;
import com.food.cart.repository.MenuItemRepository;
import com.food.cart.repository.OrderItemRepository;
import com.food.cart.repository.OrderRepository;
import com.food.cart.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnerOrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ShopRepository shopRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    public List<OrderDTO> getShopOrders(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));
        
        List<Order> orders = orderRepository.findByShopId(shop.getId());
        
        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void updateOrderStatus(Long ownerId, Long orderId, OrderStatus status) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner"));
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getShopId().equals(shop.getId())) {
            throw new ForbiddenException("You can only update orders from your own shop");
        }
        
        order.setStatus(status);
        orderRepository.save(order);
    }
    
    private OrderDTO convertToOrderDTO(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        List<OrderItemDTO> itemDTOs = orderItems.stream()
                .map(this::convertToOrderItemDTO)
                .collect(Collectors.toList());
        
        String shopName = null;
        if (order.getShop() != null) {
            shopName = order.getShop().getShopName();
        }
        
        return new OrderDTO(
                order.getId(),
                order.getShopId(),
                shopName,
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                itemDTOs
        );
    }
    
    private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
        MenuItem menuItem = menuItemRepository.findById(orderItem.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        
        return new OrderItemDTO(
                orderItem.getId(),
                menuItem.getName(),
                orderItem.getQuantity(),
                orderItem.getPriceAtOrder()
        );
    }
}
