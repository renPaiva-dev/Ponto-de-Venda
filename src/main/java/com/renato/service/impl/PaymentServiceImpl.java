package com.renato.service.impl;

import com.renato.domain.OrderStatus;
import com.renato.domain.PaymentGateway;
import com.renato.domain.PaymentStatus;
import com.renato.mapper.PaymentMapper;
import com.renato.model.Order;
import com.renato.model.Payment;
import com.renato.payload.dto.PaymentDTO;
import com.renato.repository.OrderRepository;
import com.renato.repository.PaymentRepository;
import com.renato.service.PaymentService;
import com.razorpay.RazorpayClient;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String stripeWebhookSecret;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @PostConstruct
    private void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @Override
    public PaymentDTO createStripePayment(Long orderId) throws Exception {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(toMinorUnits(order.getTotal()))
                .setCurrency("brl")
                .setDescription("Pedido #" + order.getId())
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setGateway(PaymentGateway.STRIPE);
        payment.setGatewayPaymentId(intent.getId());
        payment.setAmount(order.getTotal());
        payment.setStatus(PaymentStatus.PENDING);

        PaymentDTO dto = PaymentMapper.toDTO(paymentRepository.save(payment));
        dto.setClientSecret(intent.getClientSecret());
        return dto;
    }

    @Override
    public PaymentDTO createRazorpayPayment(Long orderId) throws Exception {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));

        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", toMinorUnits(order.getTotal()));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "pedido_" + order.getId());

        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setGateway(PaymentGateway.RAZORPAY);
        payment.setGatewayPaymentId(razorpayOrder.get("id"));
        payment.setAmount(order.getTotal());
        payment.setStatus(PaymentStatus.PENDING);

        return PaymentMapper.toDTO(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public void handleStripeWebhook(String payload, String signatureHeader) throws Exception {

        Event event = Webhook.constructEvent(payload, signatureHeader, stripeWebhookSecret);

        if (!"payment_intent.succeeded".equals(event.getType())
                && !"payment_intent.payment_failed".equals(event.getType())) {
            return;
        }

        Optional<StripeObject> stripeObject = event.getDataObjectDeserializer().getObject();
        if (stripeObject.isEmpty() || !(stripeObject.get() instanceof PaymentIntent)) {
            return;
        }

        PaymentIntent intent = (PaymentIntent) stripeObject.get();
        Payment payment = paymentRepository.findByGatewayPaymentId(intent.getId());
        if (payment == null) {
            return;
        }

        boolean succeeded = "payment_intent.succeeded".equals(event.getType());
        applyPaymentResult(payment, succeeded);
    }

    @Override
    @Transactional
    public void handleRazorpayWebhook(String payload, String signatureHeader) throws Exception {

        boolean valid = com.razorpay.Utils.verifyWebhookSignature(payload, signatureHeader, razorpayKeySecret);
        if (!valid) {
            throw new Exception("Invalid Razorpay webhook signature");
        }

        JSONObject event = new JSONObject(payload);
        String eventType = event.optString("event");

        JSONObject orderEntity = event
                .getJSONObject("payload")
                .getJSONObject("order")
                .getJSONObject("entity");

        Payment payment = paymentRepository.findByGatewayPaymentId(orderEntity.getString("id"));
        if (payment == null) {
            return;
        }

        boolean succeeded = "order.paid".equals(eventType);
        applyPaymentResult(payment, succeeded);
    }

    private void applyPaymentResult(Payment payment, boolean succeeded) {
        payment.setStatus(succeeded ? PaymentStatus.SUCCEEDED : PaymentStatus.FAILED);
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setStatus(succeeded ? OrderStatus.PAID : OrderStatus.PENDING);
        orderRepository.save(order);
    }

    private long toMinorUnits(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100)).longValue();
    }
}
