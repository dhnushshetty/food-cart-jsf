package com.food.cart.dto;

import com.food.cart.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusDTO {
    
    @NotNull(message = "Status is required")
    private OrderStatus status;
}
