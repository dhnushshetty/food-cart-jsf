package com.food.cart.service;

import com.food.cart.dto.OrderDTO;
import com.food.cart.dto.OrderItemDTO;
import com.food.cart.exception.BusinessRuleException;
import com.food.cart.exception.ResourceNotFoundException;
import com.food.cart.model.*;
import com.food.cart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Transactional
    public void placeOrder(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new BusinessRuleException("Cannot place order with empty cart");
        }

        if (cart.getShopId() == null) {
            throw new BusinessRuleException("Cart has no shop associated");
        }

        // Create order
        Order order = new Order();
        order.setCustomerId(userId);
        order.setShopId(cart.getShopId());
        order.setTotalAmount(cart.getTotalAmount());
        order.setStatus(OrderStatus.PENDING);
        order = orderRepository.save(order);

        // Create order items from cart items
        for (CartItem cartItem : cartItems) {
            MenuItem menuItem = menuItemRepository.findById(cartItem.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setMenuItemId(cartItem.getMenuItemId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtOrder(menuItem.getPrice());
            orderItemRepository.save(orderItem);
        }

        // Clear cart
        cartItemRepository.deleteAll(cartItems);
        cart.setShopId(null);
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    public List<OrderDTO> getOrderHistory(Long userId) {
        List<Order> orders = orderRepository.findByCustomerId(userId);

        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
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

        String customerUsername = null;
        if (order.getCustomer() != null) {
            customerUsername = order.getCustomer().getUsername();
        }

        return new OrderDTO(
                order.getId(),
                order.getShopId(),
                shopName,
                customerUsername,
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                itemDTOs);
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
        MenuItem menuItem = menuItemRepository.findById(orderItem.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        return new OrderItemDTO(
                orderItem.getId(),
                menuItem.getName(),
                orderItem.getQuantity(),
                orderItem.getPriceAtOrder());
    }
}
