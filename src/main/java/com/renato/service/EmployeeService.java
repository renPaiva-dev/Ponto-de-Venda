package com.renato.service;

import com.renato.exceptons.UserException;
import com.renato.payload.dto.EmployeeRequest;
import com.renato.payload.dto.UserDto;

import java.util.List;

public interface EmployeeService {

    List<UserDto> getAllEmployees() throws UserException;

    UserDto createEmployee(EmployeeRequest request) throws Exception;

    UserDto updateEmployee(Long id, EmployeeRequest request) throws Exception;
}
