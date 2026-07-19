package com.renato.payload.dto;

import com.renato.domain.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequest {

    private Long clientId;
    private PaymentMethod paymentMethod;
    private BigDecimal orderDiscount = BigDecimal.ZERO;
    private List<OrderItemRequest> items;
}
