package com.renato.service;


import com.renato.domain.StoreStatus;
import com.renato.exceptons.UserException;
import com.renato.model.Store;
import com.renato.model.User;
import com.renato.payload.dto.StoreDTO;

import java.util.List;

public interface StoreService {

    StoreDTO createStore(StoreDTO storeDTO, User user);

    StoreDTO getStoreById(Long id) throws Exception;

    List<StoreDTO> getAllStores();
    Store getStoreByAdmin() throws UserException;
    StoreDTO updateStore(Long id, StoreDTO storeDTO) throws Exception;
    void deleteStore(Long id) throws UserException;
    StoreDTO getStoreByEmployee() throws UserException;


    StoreDTO moderateStore(Long id, StoreStatus status) throws Exception;
}
