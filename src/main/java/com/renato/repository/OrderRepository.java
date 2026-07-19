package com.renato.repository;

import com.renato.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStoreId(Long storeId);

    @Query("select o from Order o where o.createdAt between :start and :end")
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("select o from Order o where o.store.id = :storeId and o.createdAt between :start and :end")
    List<Order> findByStoreIdAndCreatedAtBetween(Long storeId, LocalDateTime start, LocalDateTime end);

    @Query("select o from Order o where o.cashier.id = :cashierId and o.createdAt between :start and :end")
    List<Order> findByCashierIdAndCreatedAtBetween(Long cashierId, LocalDateTime start, LocalDateTime end);
}
