package com.renato.service;

import com.renato.payload.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {

    CategoryDTO createCategory(CategoryDTO categoryDTO) throws Exception;

    List<CategoryDTO> getAllCategories();
}
