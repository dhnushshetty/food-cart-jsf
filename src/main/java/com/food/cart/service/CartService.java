package com.food.cart.service;

import com.food.cart.dto.AddToCartDTO;
import com.food.cart.dto.CartDTO;
import com.food.cart.dto.CartItemDTO;
import com.food.cart.exception.BusinessRuleException;
import com.food.cart.exception.ResourceNotFoundException;
import com.food.cart.model.Cart;
import com.food.cart.model.CartItem;
import com.food.cart.model.MenuItem;
import com.food.cart.repository.CartItemRepository;
import com.food.cart.repository.CartRepository;
import com.food.cart.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public CartDTO getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDTO> itemDTOs = cartItems.stream()
                .map(this::convertToCartItemDTO)
                .collect(Collectors.toList());

        String shopName = null;
        if (cart.getShopId() != null && cart.getShop() != null) {
            shopName = cart.getShop().getShopName();
        }

        return new CartDTO(
                cart.getId(),
                cart.getShopId(),
                shopName,
                itemDTOs,
                cart.getTotalAmount());
    }

    @Transactional
    public void addItemToCart(Long userId, AddToCartDTO dto) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));

        MenuItem menuItem = menuItemRepository.findById(dto.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        // Check single-shop constraint
        if (cart.getShopId() == null) {
            // Cart is empty, set shop
            cart.setShopId(menuItem.getShopId());
        } else if (!cart.getShopId().equals(menuItem.getShopId())) {
            // Cart has items from different shop
            throw new BusinessRuleException("Cannot add items from different shops to cart");
        }

        // Check if item already exists in cart
        List<CartItem> existingItems = cartItemRepository.findByCartId(cart.getId());
        CartItem existingItem = existingItems.stream()
                .filter(item -> item.getMenuItemId().equals(dto.getMenuItemId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + dto.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            // Add new item
            CartItem cartItem = new CartItem();
            cartItem.setCartId(cart.getId());
            cartItem.setMenuItemId(dto.getMenuItemId());
            cartItem.setQuantity(dto.getQuantity());
            cartItemRepository.save(cartItem);
        }

        // Recalculate total
        recalculateCartTotal(cart);
    }

    @Transactional
    public void removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCartId().equals(cart.getId())) {
            throw new BusinessRuleException("Cart item does not belong to user's cart");
        }

        cartItemRepository.delete(cartItem);

        // Recalculate total and clear shop if cart is empty
        recalculateCartTotal(cart);

        // If cart is now empty, clear the shop association
        List<CartItem> remainingItems = cartItemRepository.findByCartId(cart.getId());
        if (remainingItems.isEmpty()) {
            cart.setShopId(null);
            cartRepository.save(cart);
        }
    }

    private void recalculateCartTotal(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            MenuItem menuItem = menuItemRepository.findById(item.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
            total = total.add(menuItem.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        cart.setTotalAmount(total);
        cartRepository.save(cart);
    }

    private CartItemDTO convertToCartItemDTO(CartItem cartItem) {
        MenuItem menuItem = menuItemRepository.findById(cartItem.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        return new CartItemDTO(
                cartItem.getId(),
                cartItem.getMenuItemId(),
                menuItem.getName(),
                menuItem.getPrice(),
                cartItem.getQuantity(),
                menuItem.getImageUrl());
    }
}
