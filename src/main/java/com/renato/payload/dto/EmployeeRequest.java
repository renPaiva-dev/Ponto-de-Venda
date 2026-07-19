package com.renato.payload.dto;

import com.renato.domain.UserRole;
import lombok.Data;

@Data
public class EmployeeRequest {

    private String fullName;
    private String email;
    private String phone;
    private String password;
    private UserRole role;
    private Long storeId;
}
