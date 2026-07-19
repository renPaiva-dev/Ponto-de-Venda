package com.renato.service.impl;

import com.renato.domain.OrderStatus;
import com.renato.domain.PaymentMethod;
import com.renato.model.Order;
import com.renato.model.Store;
import com.renato.model.User;
import com.renato.payload.dto.BranchMetricsDTO;
import com.renato.payload.dto.SalesSummaryDTO;
import com.renato.payload.dto.ShiftReportDTO;
import com.renato.repository.OrderRepository;
import com.renato.repository.ProductRepository;
import com.renato.repository.StoreRepository;
import com.renato.service.ReportService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public SalesSummaryDTO getSalesSummary(LocalDateTime startDate, LocalDateTime endDate) {

        List<Order> orders = orderRepository.findByCreatedAtBetween(startDate, endDate)
                .stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = sumTotals(orders);

        SalesSummaryDTO dto = new SalesSummaryDTO();
        dto.setStartDate(startDate);
        dto.setEndDate(endDate);
        dto.setTotalOrders(orders.size());
        dto.setTotalRevenue(totalRevenue);
        dto.setAverageTicket(orders.isEmpty()
                ? BigDecimal.ZERO
                : totalRevenue.divide(BigDecimal.valueOf(orders.size()), 2, java.math.RoundingMode.HALF_UP));
        return dto;
    }

    @Override
    public BranchMetricsDTO getBranchMetrics(Long storeId) throws Exception {

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new Exception("Store not found"));

        List<Order> orders = orderRepository.findByStoreId(storeId)
                .stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        BranchMetricsDTO dto = new BranchMetricsDTO();
        dto.setStoreId(store.getId());
        dto.setStoreName(store.getBrand());
        dto.setTotalOrders(orders.size());
        dto.setTotalRevenue(sumTotals(orders));
        dto.setLowStockCount(productRepository.findLowStockByStoreId(storeId).size());
        return dto;
    }

    @Override
    public ShiftReportDTO getShiftReport(Long cashierId, LocalDate date) throws Exception {

        User cashier = userService.getUserById(cashierId);

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<Order> orders = orderRepository.findByCashierIdAndCreatedAtBetween(cashierId, start, end)
                .stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        Map<PaymentMethod, BigDecimal> breakdown = orders.stream()
                .filter(order -> order.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(
                        Order::getPaymentMethod,
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotal, BigDecimal::add)));

        ShiftReportDTO dto = new ShiftReportDTO();
        dto.setCashierId(cashier.getId());
        dto.setCashierName(cashier.getFullName());
        dto.setDate(date);
        dto.setTotalOrders(orders.size());
        dto.setTotalRevenue(sumTotals(orders));
        dto.setPaymentMethodBreakdown(breakdown);
        return dto;
    }

    private BigDecimal sumTotals(List<Order> orders) {
        return orders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
