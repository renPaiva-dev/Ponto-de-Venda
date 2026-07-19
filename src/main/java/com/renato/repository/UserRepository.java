package com.renato.repository;

import com.renato.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

  User findByEmail(String email);

  List<User> findByStoreId(Long storeId);

}
