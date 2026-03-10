package com.renato.payload.response;

import com.renato.payload.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {


    private String jwt;
    private String message;
    private UserDto user;




}
