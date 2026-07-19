package com.renato.payload.dto;

import com.renato.domain.PaymentGateway;
import com.renato.domain.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {

    private Long id;
    private Long orderId;
    private PaymentGateway gateway;
    private String gatewayPaymentId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String clientSecret;
    private LocalDateTime createdAt;
}
