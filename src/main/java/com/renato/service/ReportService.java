package com.renato.service;

import com.renato.payload.dto.BranchMetricsDTO;
import com.renato.payload.dto.SalesSummaryDTO;
import com.renato.payload.dto.ShiftReportDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface ReportService {

    SalesSummaryDTO getSalesSummary(LocalDateTime startDate, LocalDateTime endDate) throws Exception;

    BranchMetricsDTO getBranchMetrics(Long storeId) throws Exception;

    ShiftReportDTO getShiftReport(Long cashierId, LocalDate date) throws Exception;
}
