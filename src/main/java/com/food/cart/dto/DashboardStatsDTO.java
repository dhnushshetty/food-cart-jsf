package com.food.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    
    private BigDecimal totalRevenue;
    private Long pendingOrdersCount;
    private List<TopItemDTO> topSellingItems;
}
