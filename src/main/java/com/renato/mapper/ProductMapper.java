package com.renato.mapper;

import com.renato.model.Category;
import com.renato.model.Product;
import com.renato.model.Store;
import com.renato.payload.dto.ProductDTO;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setCategory(CategoryMapper.toDTO(product.getCategory()));
        dto.setStoreId(product.getStore() != null ? product.getStore().getId() : null);
        dto.setStockQuantity(product.getStockQuantity());
        dto.setMinStockQuantity(product.getMinStockQuantity());
        dto.setActive(product.isActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    public static Product toEntity(ProductDTO dto, Category category, Store store) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setSku(dto.getSku());
        product.setPrice(dto.getPrice());
        product.setCategory(category);
        product.setStore(store);
        product.setStockQuantity(dto.getStockQuantity());
        product.setMinStockQuantity(dto.getMinStockQuantity());
        return product;
    }
}
