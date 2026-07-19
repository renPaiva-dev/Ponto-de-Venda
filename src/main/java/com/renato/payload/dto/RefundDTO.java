package com.renato.payload.dto;

import com.renato.domain.RefundStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RefundDTO {

    private Long id;
    private Long orderId;
    private Long paymentId;
    private BigDecimal amount;
    private String reason;
    private RefundStatus status;
    private LocalDateTime createdAt;
}
