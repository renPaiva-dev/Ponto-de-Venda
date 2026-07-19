package com.renato.payload.dto;

import com.renato.domain.OrderStatus;
import com.renato.domain.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {

    private Long id;
    private Long storeId;
    private Long cashierId;
    private String cashierName;
    private Long clientId;
    private List<OrderItemDTO> items;
    private BigDecimal subtotal;
    private BigDecimal discountTotal;
    private BigDecimal total;
    private PaymentMethod paymentMethod;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
