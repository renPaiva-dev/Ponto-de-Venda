package com.renato.service.impl;

import com.renato.domain.UserRole;
import com.renato.exceptons.UserException;
import com.renato.mapper.ProductMapper;
import com.renato.model.Product;
import com.renato.model.User;
import com.renato.payload.dto.ProductDTO;
import com.renato.repository.ProductRepository;
import com.renato.service.StockService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final ProductRepository productRepository;
    private final UserService userService;

    @Override
    public List<ProductDTO> getLowStockProducts() throws UserException {

        User currentUser = userService.getCurrentUser();
        List<Product> products = currentUser.getRole() == UserRole.ROLE_ADMIN
                ? productRepository.findAllLowStock()
                : productRepository.findLowStockByStoreId(currentUser.getStore().getId());

        return products.stream().map(ProductMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_ADMIN', 'BRANCH_MANAGER', 'STORE_MANAGER')")
    public ProductDTO updateStock(Long productId, int quantityChange) throws Exception {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new Exception("Product not found"));

        int newQuantity = product.getStockQuantity() + quantityChange;
        if (newQuantity < 0) {
            throw new Exception("Stock quantity cannot go below zero");
        }

        product.setStockQuantity(newQuantity);
        return ProductMapper.toDTO(productRepository.save(product));
    }
}
