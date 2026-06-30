package com.renato.controller;


import com.renato.exceptons.UserException;
import com.renato.mapper.StoreMapper;
import com.renato.model.User;
import com.renato.payload.dto.StoreDTO;
import com.renato.service.StoreService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {

    private final StoreService storeService;
    private final UserService userService;
    public ResponseEntity<StoreDTO> createStore(@RequestBody StoreDTO storeDTO,

                                                @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        return ResponseEntity.ok(storeService.createStore(storeDTO, user));

    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDTO> getStoreById(@PathVariable Long Id, @RequestBody StoreDTO storeDTO,

                                                @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        return ResponseEntity.ok(storeService.createStore(storeDTO, user));

    }
    }

