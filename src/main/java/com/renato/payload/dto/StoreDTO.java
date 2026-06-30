package com.renato.payload.dto;

import com.renato.domain.StoreStatus;
import com.renato.model.StoreContact;
import com.renato.model.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Data
public class StoreDTO {


    private Long id;

    private String brand;

    private UserDto storeAdmin;


    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String description;

    private String storeType;


    private StoreStatus status;

    private StoreContact contact;

}
