package com.renato.controller;

import com.renato.payload.dto.EmployeeRequest;
import com.renato.payload.dto.UserDto;
import com.renato.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/funcionarios")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllEmployees() throws Exception {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @PostMapping
    public ResponseEntity<UserDto> createEmployee(@RequestBody EmployeeRequest request) throws Exception {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeRequest request) throws Exception {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }
}
