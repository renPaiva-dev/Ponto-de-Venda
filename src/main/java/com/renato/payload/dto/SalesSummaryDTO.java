package com.renato.payload.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SalesSummaryDTO {

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal averageTicket;
}
