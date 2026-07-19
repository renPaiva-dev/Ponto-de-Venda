package com.renato.payload.dto;

import com.renato.domain.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {

    private OrderStatus status;
}
