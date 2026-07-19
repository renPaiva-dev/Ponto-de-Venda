package com.renato.service.impl;

import com.renato.domain.UserRole;
import com.renato.exceptons.UserException;
import com.renato.mapper.UserMapper;
import com.renato.model.Store;
import com.renato.model.User;
import com.renato.payload.dto.EmployeeRequest;
import com.renato.payload.dto.UserDto;
import com.renato.repository.StoreRepository;
import com.renato.repository.UserRepository;
import com.renato.service.EmployeeService;
import com.renato.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Override
    public List<UserDto> getAllEmployees() throws UserException {

        User currentUser = userService.getCurrentUser();
        List<User> employees = currentUser.getRole() == UserRole.ROLE_ADMIN
                ? userRepository.findAll()
                : userRepository.findByStoreId(currentUser.getStore().getId());

        return employees.stream()
                .filter(user -> user.getRole() != UserRole.ROLE_USER)
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_ADMIN')")
    public UserDto createEmployee(EmployeeRequest request) throws Exception {

        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new Exception("email id already registered");
        }

        User currentUser = userService.getCurrentUser();
        assertCanAssignRole(currentUser, request.getRole());
        Store store = resolveStore(currentUser, request.getStoreId());

        User employee = new User();
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setRole(request.getRole());
        employee.setStore(store);
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());

        return UserMapper.toDTO(userRepository.save(employee));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_ADMIN', 'BRANCH_MANAGER')")
    public UserDto updateEmployee(Long id, EmployeeRequest request) throws Exception {

        User employee = userRepository.findById(id)
                .orElseThrow(() -> new Exception("Employee not found"));

        User currentUser = userService.getCurrentUser();

        employee.setFullName(request.getFullName());
        employee.setPhone(request.getPhone());

        if (request.getRole() != null) {
            assertCanAssignRole(currentUser, request.getRole());
            employee.setRole(request.getRole());
        }

        if (currentUser.getRole() == UserRole.ROLE_ADMIN && request.getStoreId() != null) {
            employee.setStore(resolveStore(currentUser, request.getStoreId()));
        }

        return UserMapper.toDTO(userRepository.save(employee));
    }

    private void assertCanAssignRole(User currentUser, UserRole targetRole) throws Exception {
        boolean isPrivilegedRole = targetRole == UserRole.ROLE_ADMIN
                || targetRole == UserRole.ROLE_STORE_ADMIN;

        if (isPrivilegedRole && currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new Exception("Only a network administrator can assign this role");
        }
    }

    private Store resolveStore(User currentUser, Long storeId) throws Exception {
        if (currentUser.getRole() == UserRole.ROLE_ADMIN && storeId != null) {
            return storeRepository.findById(storeId)
                    .orElseThrow(() -> new Exception("Store not found"));
        }

        if (currentUser.getStore() == null) {
            throw new Exception("Current user has no store assigned");
        }

        return currentUser.getStore();
    }
}
