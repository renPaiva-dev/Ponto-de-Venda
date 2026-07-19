package com.renato.service.impl;

import com.razorpay.RazorpayClient;
import com.renato.domain.OrderStatus;
import com.renato.domain.PaymentStatus;
import com.renato.domain.RefundStatus;
import com.renato.mapper.RefundMapper;
import com.renato.model.Order;
import com.renato.model.Payment;
import com.renato.model.Refund;
import com.renato.model.User;
import com.renato.payload.dto.RefundDTO;
import com.renato.payload.dto.RefundRequest;
import com.renato.repository.OrderRepository;
import com.renato.repository.PaymentRepository;
import com.renato.repository.RefundRepository;
import com.renato.service.RefundService;
import com.renato.service.UserService;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final UserService userService;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @Override
    @Transactional
    public RefundDTO requestRefund(RefundRequest request) throws Exception {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new Exception("Order not found"));

        Payment payment = request.getPaymentId() != null
                ? paymentRepository.findById(request.getPaymentId())
                        .orElseThrow(() -> new Exception("Payment not found"))
                : paymentRepository.findTopByOrderIdOrderByCreatedAtDesc(order.getId());

        if (payment == null) {
            throw new Exception("No payment found for this order");
        }

        User currentUser = userService.getCurrentUser();

        Refund refund = new Refund();
        refund.setOrder(order);
        refund.setPayment(payment);
        refund.setAmount(request.getAmount());
        refund.setReason(request.getReason());
        refund.setRequestedBy(currentUser);

        boolean succeeded = callGatewayRefund(payment, request.getAmount());
        refund.setStatus(succeeded ? RefundStatus.PROCESSED : RefundStatus.REJECTED);

        if (succeeded) {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
            order.setStatus(OrderStatus.REFUNDED);
            orderRepository.save(order);
        }

        return RefundMapper.toDTO(refundRepository.save(refund));
    }

    @Override
    public RefundDTO getRefundById(Long id) throws Exception {
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new Exception("Refund not found"));
        return RefundMapper.toDTO(refund);
    }

    private boolean callGatewayRefund(Payment payment, BigDecimal amount) throws Exception {
        switch (payment.getGateway()) {
            case STRIPE -> {
                RefundCreateParams params = RefundCreateParams.builder()
                        .setPaymentIntent(payment.getGatewayPaymentId())
                        .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue())
                        .build();
                com.stripe.model.Refund stripeRefund = com.stripe.model.Refund.create(params);
                return stripeRefund.getId() != null;
            }
            case RAZORPAY -> {
                RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject refundRequest = new JSONObject();
                refundRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue());
                com.razorpay.Refund razorpayRefund = razorpayClient.payments.refund(
                        payment.getGatewayPaymentId(), refundRequest);
                return razorpayRefund.get("id") != null;
            }
            default -> throw new Exception("Unsupported payment gateway");
        }
    }
}
