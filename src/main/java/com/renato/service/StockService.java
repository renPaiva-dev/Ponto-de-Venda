package com.renato.service;

import com.renato.exceptons.UserException;
import com.renato.payload.dto.ProductDTO;

import java.util.List;

public interface StockService {

    List<ProductDTO> getLowStockProducts() throws UserException;

    ProductDTO updateStock(Long productId, int quantityChange) throws Exception;
}
