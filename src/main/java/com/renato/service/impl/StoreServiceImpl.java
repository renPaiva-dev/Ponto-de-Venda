package com.renato.service.impl;

import com.renato.exceptons.UserException;
import com.renato.mapper.StoreMapper;
import com.renato.model.Store;
import com.renato.model.StoreContact;
import com.renato.model.User;
import com.renato.payload.dto.StoreDTO;
import com.renato.repository.StoreRepository;
import com.renato.service.StoreService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public StoreDTO createStore(StoreDTO storeDTO, User user) {

        Store store = StoreMapper.toEntity(storeDTO, user);

        return StoreMapper.toDTO(storeRepository.save(store));
    }


    @Override
    public StoreDTO getStoreById(Long id) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                ()-> new Exception("Store not found...")
        );
        return StoreMapper.toDTO(store);
    }

    @Override
    public List<StoreDTO> getAllStores() {
        List<Store> dtos = storeRepository.findAll();
        return dtos.stream().map(StoreMapper::toDTO).collect(Collectors.toList());

    }

    @Override
    public Store getStoreByAdmin() throws UserException {
        User admin=userService.getCurrentUser();
        return storeRepository.findByStoreAdminId(admin.getId());
    }

    @Override
    public StoreDTO updateStore(Long id, StoreDTO storeDTO) throws Exception {
        User currentUser=userService.getCurrentUser();

        Store existing= storeRepository.findByStoreAdminId(currentUser.getId());

        if(existing==null){
            throw new Exception("Store not found");
        }

        existing.setBrand(storeDTO.getBrand());
        existing.setDescription(storeDTO.getDescription());

        if(storeDTO.getStoreType()!=null){
            existing.setStoreType(storeDTO.getStoreType());
        }

        if(storeDTO.getContact()!=null){
            StoreContact contact=StoreContact.builder()
                    .address(storeDTO.getContact().getAddress())
                    .phone(storeDTO.getContact().getPhone())
                    .email(storeDTO.getContact().getEmail())
                    .build();
            existing.setContact(contact);
        }
        Store updatedStore=storeRepository.save(existing);
        return StoreMapper.toDTO(updatedStore);

    }

    @Override
    public void deleteStore(Long id) throws UserException{
        Store store = getStoreByAdmin();
        storeRepository.delete(store);
    }

    @Override
    public StoreDTO getStoreByEmployee() throws UserException {
        User currentUser=userService.getCurrentUser();

        if(currentUser==null){
            throw new UserException("You don't have access to this store");
        }
        return StoreMapper.toDTO(currentUser.getStore());
    }
}
