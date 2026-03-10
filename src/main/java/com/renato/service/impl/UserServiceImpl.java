package com.renato.service.impl;

import com.renato.configuration.JwtProvider;
import com.renato.exceptons.UserException;
import com.renato.model.User;
import com.renato.repository.UserRepository;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    public User getUserFromJwt(String token) throws UserException {
        return getUserFromJwtToken(token);
    }

    @Override
    public User getUserFromJwtToken(String token) throws UserException {

        String email = jwtProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("Invalid token");
        }

        return user;
    }

    @Override
    public User getCurrentUser() throws UserException {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("User not found.");
        }

        return user;
    }

    @Override
    public User getUserByEmail(String email) throws UserException {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("User not found.");
        }

        return user;
    }

    @Override
    public User getUserById(Long id) throws UserException, Exception {

        return userRepository
                .findById(id)
                .orElseThrow(
                        () -> new Exception("User not found."));
    }

    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }
}