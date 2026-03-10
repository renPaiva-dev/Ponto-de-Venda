package com.renato.controller;

import com.renato.exceptons.UserException;
import com.renato.mapper.UserMapper;
import com.renato.model.User;
import com.renato.payload.dto.UserDto;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(
            @RequestHeader("Authorization") String jwt

    ) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id

    ) throws UserException, Exception {
        User user= userService.getUserById(id);

        return ResponseEntity.ok(UserMapper.toDTO(user));
    }
}
