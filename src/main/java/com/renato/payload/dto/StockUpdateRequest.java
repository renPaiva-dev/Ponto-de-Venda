package com.renato.payload.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {

    private int quantityChange;
    private String reason;
}
