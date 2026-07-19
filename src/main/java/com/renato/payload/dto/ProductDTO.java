package com.renato.payload.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal price;
    private CategoryDTO category;
    private Long storeId;
    private Integer stockQuantity;
    private Integer minStockQuantity;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
