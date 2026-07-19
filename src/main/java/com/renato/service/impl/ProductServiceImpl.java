package com.renato.service.impl;

import com.renato.domain.UserRole;
import com.renato.exceptons.UserException;
import com.renato.mapper.ProductMapper;
import com.renato.model.Category;
import com.renato.model.Product;
import com.renato.model.Store;
import com.renato.model.User;
import com.renato.payload.dto.ProductDTO;
import com.renato.repository.CategoryRepository;
import com.renato.repository.ProductRepository;
import com.renato.repository.StoreRepository;
import com.renato.service.ProductService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_ADMIN', 'BRANCH_MANAGER')")
    public ProductDTO createProduct(ProductDTO productDTO) throws Exception {

        Store store = resolveStore(productDTO.getStoreId());
        Category category = resolveCategory(productDTO.getCategory() != null ? productDTO.getCategory().getId() : null);

        Product product = ProductMapper.toEntity(productDTO, category, store);
        return ProductMapper.toDTO(productRepository.save(product));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_ADMIN', 'BRANCH_MANAGER')")
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) throws Exception {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new Exception("Product not found"));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setSku(productDTO.getSku());
        product.setPrice(productDTO.getPrice());

        if (productDTO.getCategory() != null) {
            product.setCategory(resolveCategory(productDTO.getCategory().getId()));
        }

        return ProductMapper.toDTO(productRepository.save(product));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_ADMIN')")
    public void deleteProduct(Long id) throws Exception {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new Exception("Product not found"));

        productRepository.delete(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() throws UserException {

        User currentUser = userService.getCurrentUser();
        List<Product> products = currentUser.getRole() == UserRole.ROLE_ADMIN
                ? productRepository.findAll()
                : productRepository.findByStoreId(currentUser.getStore().getId());

        return products.stream().map(ProductMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Long id) throws Exception {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new Exception("Product not found"));

        return ProductMapper.toDTO(product);
    }

    private Store resolveStore(Long storeId) throws Exception {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() == UserRole.ROLE_ADMIN && storeId != null) {
            return storeRepository.findById(storeId)
                    .orElseThrow(() -> new Exception("Store not found"));
        }

        if (currentUser.getStore() == null) {
            throw new Exception("Current user has no store assigned");
        }

        return currentUser.getStore();
    }

    private Category resolveCategory(Long categoryId) throws Exception {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new Exception("Category not found"));
    }
}
