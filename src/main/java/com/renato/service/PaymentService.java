package com.renato.service;

import com.renato.payload.dto.PaymentDTO;

public interface PaymentService {

    PaymentDTO createStripePayment(Long orderId) throws Exception;

    PaymentDTO createRazorpayPayment(Long orderId) throws Exception;

    void handleStripeWebhook(String payload, String signatureHeader) throws Exception;

    void handleRazorpayWebhook(String payload, String signatureHeader) throws Exception;
}
