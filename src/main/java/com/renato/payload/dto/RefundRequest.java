package com.renato.payload.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RefundRequest {

    private Long orderId;
    private Long paymentId;
    private BigDecimal amount;
    private String reason;
}
