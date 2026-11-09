package com.badmintion.backend.service;

import com.badmintion.backend.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {
    List<CustomerDTO> getAllCustomers();
    List<CustomerDTO> searchCustomers(String keyword);
    CustomerDTO getCustomerById(Integer id);
    CustomerDTO getCustomerProfile(String email);
    CustomerDTO updateCustomerProfile(String email, CustomerDTO dto);
    CustomerDTO createCustomer(CustomerDTO dto);
    CustomerDTO updateCustomer(Integer id, CustomerDTO dto);
    void deleteCustomer(Integer id);
}

