package com.renato.payload.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClientDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String document;
    private String address;
    private LocalDateTime createdAt;
}
