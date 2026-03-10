package com.renato.service;

import com.renato.exceptons.UserException;
import com.renato.payload.dto.UserDto;
import com.renato.payload.response.AuthResponse;

public interface AuthService {

   AuthResponse signup(UserDto userDto) throws UserException;

    AuthResponse login(UserDto userDto) throws UserException;
}