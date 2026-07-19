package com.renato.mapper;

import com.renato.model.Refund;
import com.renato.payload.dto.RefundDTO;

public class RefundMapper {

    public static RefundDTO toDTO(Refund refund) {
        RefundDTO dto = new RefundDTO();
        dto.setId(refund.getId());
        dto.setOrderId(refund.getOrder().getId());
        dto.setPaymentId(refund.getPayment() != null ? refund.getPayment().getId() : null);
        dto.setAmount(refund.getAmount());
        dto.setReason(refund.getReason());
        dto.setStatus(refund.getStatus());
        dto.setCreatedAt(refund.getCreatedAt());
        return dto;
    }
}
