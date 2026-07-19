package com.renato.controller;

import com.renato.payload.dto.BranchMetricsDTO;
import com.renato.payload.dto.SalesSummaryDTO;
import com.renato.payload.dto.ShiftReportDTO;
import com.renato.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/relatorios")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/vendas")
    public ResponseEntity<SalesSummaryDTO> getSalesSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) throws Exception {
        return ResponseEntity.ok(reportService.getSalesSummary(startDate, endDate));
    }

    @GetMapping("/filial/{id}")
    public ResponseEntity<BranchMetricsDTO> getBranchMetrics(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(reportService.getBranchMetrics(id));
    }

    @GetMapping("/turno")
    public ResponseEntity<ShiftReportDTO> getShiftReport(
            @RequestParam Long cashierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) throws Exception {
        return ResponseEntity.ok(reportService.getShiftReport(cashierId, date));
    }
}
