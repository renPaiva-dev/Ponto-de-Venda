package com.renato.service;

import com.renato.domain.OrderStatus;
import com.renato.payload.dto.CreateOrderRequest;
import com.renato.payload.dto.OrderDTO;

import java.util.List;

public interface OrderService {

    OrderDTO createOrder(CreateOrderRequest request) throws Exception;

    OrderDTO getOrderById(Long id) throws Exception;

    List<OrderDTO> getAllOrders() throws Exception;

    OrderDTO updateOrderStatus(Long id, OrderStatus status) throws Exception;
}
