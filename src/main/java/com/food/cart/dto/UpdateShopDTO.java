package com.food.cart.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShopDTO {

    @NotBlank(message = "Shop name is required")
    private String shopName;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    // Optional field for shop image (base64 data URL or external URL)
    private String imageUrl;
}
