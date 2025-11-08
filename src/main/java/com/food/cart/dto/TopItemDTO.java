package com.food.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopItemDTO {
    
    private Long menuItemId;
    private String menuItemName;
    private Long totalQuantity;
}
