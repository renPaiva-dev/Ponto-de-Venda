package com.renato.payload.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BranchMetricsDTO {

    private Long storeId;
    private String storeName;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long lowStockCount;
}
