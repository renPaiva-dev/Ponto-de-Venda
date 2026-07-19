package com.renato.controller;

import com.renato.payload.dto.PaymentDTO;
import com.renato.payload.dto.PaymentRequest;
import com.renato.payload.response.ApiResponse;
import com.renato.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pagamentos")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/stripe")
    public ResponseEntity<PaymentDTO> payWithStripe(@RequestBody PaymentRequest request) throws Exception {
        return ResponseEntity.ok(paymentService.createStripePayment(request.getOrderId()));
    }

    @PostMapping("/razorpay")
    public ResponseEntity<PaymentDTO> payWithRazorpay(@RequestBody PaymentRequest request) throws Exception {
        return ResponseEntity.ok(paymentService.createRazorpayPayment(request.getOrderId()));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse> webhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String razorpaySignature) throws Exception {

        if (stripeSignature != null) {
            paymentService.handleStripeWebhook(payload, stripeSignature);
        } else if (razorpaySignature != null) {
            paymentService.handleRazorpayWebhook(payload, razorpaySignature);
        }

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("webhook processed");
        return ResponseEntity.ok(apiResponse);
    }
}
