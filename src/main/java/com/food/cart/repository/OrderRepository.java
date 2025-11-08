package com.food.cart.repository;

import com.food.cart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByShopId(Long shopId);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.shopId = :shopId AND o.status = 'DELIVERED'")
    BigDecimal calculateTotalRevenue(@Param("shopId") Long shopId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.shopId = :shopId AND o.status = 'PENDING'")
    Long countPendingOrders(@Param("shopId") Long shopId);
    
    @Query("SELECT oi.menuItemId, SUM(oi.quantity) as total FROM OrderItem oi " +
           "JOIN Order o ON oi.orderId = o.id WHERE o.shopId = :shopId " +
           "GROUP BY oi.menuItemId ORDER BY total DESC")
    List<Object[]> findTopSellingItems(@Param("shopId") Long shopId);
}
