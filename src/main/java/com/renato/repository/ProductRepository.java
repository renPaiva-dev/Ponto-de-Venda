package com.renato.repository;

import com.renato.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStoreId(Long storeId);

    @Query("select p from Product p where p.stockQuantity <= p.minStockQuantity and p.store.id = :storeId")
    List<Product> findLowStockByStoreId(Long storeId);

    @Query("select p from Product p where p.stockQuantity <= p.minStockQuantity")
    List<Product> findAllLowStock();
}
