package com.renato.service;

import com.renato.exceptons.UserException;
import com.renato.model.User;

import java.util.List;

public interface UserService {



    User getUserFromJwt(String token) throws UserException;
    User getCurrentUser() throws UserException;
    User getUserByEmail(String email) throws UserException;
    User getUserById(Long id) throws UserException, Exception;
    List<User> getAllUsers();

    User getUserFromJwtToken(String jwt) throws UserException;
}
