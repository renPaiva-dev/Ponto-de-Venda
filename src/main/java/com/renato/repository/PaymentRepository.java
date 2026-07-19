package com.renato.repository;

import com.renato.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByGatewayPaymentId(String gatewayPaymentId);

    Payment findTopByOrderIdOrderByCreatedAtDesc(Long orderId);
}
