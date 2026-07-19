package com.renato.controller;

import com.renato.payload.dto.RefundDTO;
import com.renato.payload.dto.RefundRequest;
import com.renato.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reembolsos")
public class RefundController {

    private final RefundService refundService;

    @PostMapping
    public ResponseEntity<RefundDTO> requestRefund(@RequestBody RefundRequest request) throws Exception {
        return ResponseEntity.ok(refundService.requestRefund(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RefundDTO> getRefundById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(refundService.getRefundById(id));
    }
}
