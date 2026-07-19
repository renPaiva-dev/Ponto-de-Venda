package com.renato.repository;

import com.renato.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category findByNameIgnoreCase(String name);
}
