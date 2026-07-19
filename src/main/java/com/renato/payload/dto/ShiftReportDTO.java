package com.renato.payload.dto;

import com.renato.domain.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
public class ShiftReportDTO {

    private Long cashierId;
    private String cashierName;
    private LocalDate date;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private Map<PaymentMethod, BigDecimal> paymentMethodBreakdown;
}
