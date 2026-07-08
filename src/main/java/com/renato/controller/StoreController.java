package com.renato.controller;


import com.renato.domain.StoreStatus;
import com.renato.exceptons.UserException;
import com.renato.mapper.StoreMapper;
import com.renato.model.User;
import com.renato.payload.dto.StoreDTO;
import com.renato.payload.response.ApiResponse;
import com.renato.service.StoreService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;
    private final UserService userService;
    public ResponseEntity<StoreDTO> createStore(@RequestBody StoreDTO storeDTO,

                                                @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        return ResponseEntity.ok(storeService.createStore(storeDTO, user));

    }

    @GetMapping()
    public ResponseEntity<List<StoreDTO>> getAllStore(
            @RequestHeader("Authorization") String jwt) throws Exception {


        return ResponseEntity.ok(storeService.getAllStores());

    }

    @GetMapping("/admin")
    public ResponseEntity<StoreDTO> getStoreByAdmin(
            @RequestHeader("Authorization") String jwt) throws Exception {


        return ResponseEntity.ok(StoreMapper.toDTO(storeService.getStoreByAdmin()));

    }

    @GetMapping("/employee")
    public ResponseEntity<StoreDTO> getStoreByEmployee(
            @RequestHeader("Authorization") String jwt) throws Exception {


        return ResponseEntity.ok(storeService.getStoreByEmployee());

    }

    @PutMapping("/{id}/moderate")
    public ResponseEntity<StoreDTO> moderateStore(
            @PathVariable Long id,
            @RequestParam StoreStatus status) throws Exception {

        return ResponseEntity.ok(storeService.moderateStore(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteStore(
            @PathVariable Long id) throws Exception {

        storeService.deleteStore(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("successfully deleted store");
        return ResponseEntity.ok(apiResponse);

    }
    @GetMapping("/{id}")
    public ResponseEntity<StoreDTO> getStoreById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {


        return ResponseEntity.ok(storeService.getStoreById(id));

    }

    }

