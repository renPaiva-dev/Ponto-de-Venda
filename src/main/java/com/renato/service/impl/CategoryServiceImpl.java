package com.renato.service.impl;

import com.renato.mapper.CategoryMapper;
import com.renato.model.Category;
import com.renato.payload.dto.CategoryDTO;
import com.renato.repository.CategoryRepository;
import com.renato.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_ADMIN')")
    public CategoryDTO createCategory(CategoryDTO categoryDTO) throws Exception {

        if (categoryRepository.findByNameIgnoreCase(categoryDTO.getName()) != null) {
            throw new Exception("Category already exists");
        }

        Category category = CategoryMapper.toEntity(categoryDTO);
        return CategoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());
    }
}
