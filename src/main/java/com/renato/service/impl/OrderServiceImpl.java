package com.renato.service.impl;

import com.renato.domain.OrderStatus;
import com.renato.domain.UserRole;
import com.renato.mapper.OrderMapper;
import com.renato.model.Client;
import com.renato.model.Order;
import com.renato.model.OrderItem;
import com.renato.model.Product;
import com.renato.model.User;
import com.renato.payload.dto.CreateOrderRequest;
import com.renato.payload.dto.OrderDTO;
import com.renato.payload.dto.OrderItemRequest;
import com.renato.repository.ClientRepository;
import com.renato.repository.OrderRepository;
import com.renato.repository.ProductRepository;
import com.renato.service.OrderService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final UserService userService;

    @Override
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request) throws Exception {

        User cashier = userService.getCurrentUser();
        if (cashier.getStore() == null) {
            throw new Exception("Current user has no store assigned");
        }

        Order order = new Order();
        order.setStore(cashier.getStore());
        order.setCashier(cashier);
        order.setPaymentMethod(request.getPaymentMethod());

        if (request.getClientId() != null) {
            Client client = clientRepository.findById(request.getClientId())
                    .orElseThrow(() -> new Exception("Client not found"));
            order.setClient(client);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal itemDiscounts = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new Exception("Product not found"));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new Exception("Insufficient stock for product " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            BigDecimal discount = itemRequest.getDiscount() != null ? itemRequest.getDiscount() : BigDecimal.ZERO;
            BigDecimal lineSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            BigDecimal lineTotal = lineSubtotal.subtract(discount);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setDiscount(discount);
            item.setTotal(lineTotal);
            order.getItems().add(item);

            subtotal = subtotal.add(lineSubtotal);
            itemDiscounts = itemDiscounts.add(discount);
        }

        BigDecimal orderDiscount = request.getOrderDiscount() != null ? request.getOrderDiscount() : BigDecimal.ZERO;
        BigDecimal discountTotal = itemDiscounts.add(orderDiscount);

        order.setSubtotal(subtotal);
        order.setDiscountTotal(discountTotal);
        order.setTotal(subtotal.subtract(discountTotal));

        return OrderMapper.toDTO(orderRepository.save(order));
    }

    @Override
    public OrderDTO getOrderById(Long id) throws Exception {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new Exception("Order not found"));
        return OrderMapper.toDTO(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() throws Exception {
        User currentUser = userService.getCurrentUser();
        List<Order> orders = currentUser.getRole() == UserRole.ROLE_ADMIN
                ? orderRepository.findAll()
                : orderRepository.findByStoreId(currentUser.getStore().getId());

        return orders.stream().map(OrderMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus status) throws Exception {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new Exception("Order not found"));

        if (status == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            restoreStock(order);
        }

        order.setStatus(status);
        return OrderMapper.toDTO(orderRepository.save(order));
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
    }
}
