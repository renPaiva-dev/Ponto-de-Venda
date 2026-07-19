package com.renato.service;

import com.renato.exceptons.UserException;
import com.renato.payload.dto.ProductDTO;

import java.util.List;

public interface ProductService {

    ProductDTO createProduct(ProductDTO productDTO) throws Exception;

    ProductDTO updateProduct(Long id, ProductDTO productDTO) throws Exception;

    void deleteProduct(Long id) throws Exception;

    List<ProductDTO> getAllProducts() throws UserException;

    ProductDTO getProductById(Long id) throws Exception;
}
