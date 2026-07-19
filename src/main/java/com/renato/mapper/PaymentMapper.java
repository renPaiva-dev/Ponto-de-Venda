package com.renato.mapper;

import com.renato.model.Payment;
import com.renato.payload.dto.PaymentDTO;

public class PaymentMapper {

    public static PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setOrderId(payment.getOrder().getId());
        dto.setGateway(payment.getGateway());
        dto.setGatewayPaymentId(payment.getGatewayPaymentId());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }
}
