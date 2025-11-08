package com.food.cart.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "shops")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shop {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "shop_name", nullable = false)
    private String shopName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String address;
    
    @Column(name = "owner_id", nullable = false, unique = true)
    private Long ownerId;
    
    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private List<MenuItem> menuItems;
}
