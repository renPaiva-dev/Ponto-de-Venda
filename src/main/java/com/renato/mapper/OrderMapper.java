package com.renato.mapper;

import com.renato.model.Order;
import com.renato.model.OrderItem;
import com.renato.payload.dto.OrderDTO;
import com.renato.payload.dto.OrderItemDTO;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setStoreId(order.getStore() != null ? order.getStore().getId() : null);
        dto.setCashierId(order.getCashier() != null ? order.getCashier().getId() : null);
        dto.setCashierName(order.getCashier() != null ? order.getCashier().getFullName() : null);
        dto.setClientId(order.getClient() != null ? order.getClient().getId() : null);
        dto.setItems(toItemDTOs(order.getItems()));
        dto.setSubtotal(order.getSubtotal());
        dto.setDiscountTotal(order.getDiscountTotal());
        dto.setTotal(order.getTotal());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    private static List<OrderItemDTO> toItemDTOs(List<OrderItem> items) {
        return items.stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setUnitPrice(item.getUnitPrice());
            itemDTO.setDiscount(item.getDiscount());
            itemDTO.setTotal(item.getTotal());
            return itemDTO;
        }).collect(Collectors.toList());
    }
}
