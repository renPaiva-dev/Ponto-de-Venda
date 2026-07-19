package com.renato.service;

import com.renato.payload.dto.RefundDTO;
import com.renato.payload.dto.RefundRequest;

public interface RefundService {

    RefundDTO requestRefund(RefundRequest request) throws Exception;

    RefundDTO getRefundById(Long id) throws Exception;
}
