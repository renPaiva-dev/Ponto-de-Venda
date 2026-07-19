package com.renato.controller;

import com.renato.payload.dto.ProductDTO;
import com.renato.payload.dto.StockUpdateRequest;
import com.renato.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/estoque")
public class StockController {

    private final StockService stockService;

    @GetMapping("/alertas")
    public ResponseEntity<List<ProductDTO>> getStockAlerts() throws Exception {
        return ResponseEntity.ok(stockService.getLowStockProducts());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProductDTO> updateStock(
            @PathVariable Long id,
            @RequestBody StockUpdateRequest request) throws Exception {
        return ResponseEntity.ok(stockService.updateStock(id, request.getQuantityChange()));
    }
}
