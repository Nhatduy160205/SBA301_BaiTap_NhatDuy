package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.CustomerDTO;
import com.badmintion.backend.entity.Customer;
import com.badmintion.backend.exception.BadRequestException;
import com.badmintion.backend.exception.ResourceNotFoundException;
import com.badmintion.backend.repository.CustomerRepository;
import com.badmintion.backend.service.CustomerService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerServiceImpl(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private CustomerDTO mapToDTO(Customer customer) {
        return CustomerDTO.builder()
                .customerID(customer.getCustomerID())
                .customerFullName(customer.getCustomerFullName())
                .telephone(customer.getTelephone())
                .emailAddress(customer.getEmailAddress())
                .customerBirthday(customer.getCustomerBirthday())
                .customerStatus(customer.getCustomerStatus())
                .password(null) // do not return hash in DTO
                .build();
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> searchCustomers(String keyword) {
        String query = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return customerRepository.searchCustomers(query).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerDTO getCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return mapToDTO(customer);
    }

    @Override
    public CustomerDTO getCustomerProfile(String email) {
        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return mapToDTO(customer);
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomerProfile(String email, CustomerDTO dto) {
        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));

        customer.setCustomerFullName(dto.getCustomerFullName().trim());
        customer.setTelephone(dto.getTelephone().trim());
        customer.setCustomerBirthday(dto.getCustomerBirthday());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            if (dto.getPassword().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters long");
            }
            customer.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        customer = customerRepository.save(customer);
        return mapToDTO(customer);
    }

    @Override
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO dto) {
        if (customerRepository.existsByEmailAddress(dto.getEmailAddress().trim())) {
            throw new BadRequestException("Email already exists: " + dto.getEmailAddress());
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new BadRequestException("Password is required for new customer");
        }

        Customer customer = Customer.builder()
                .customerFullName(dto.getCustomerFullName().trim())
                .telephone(dto.getTelephone().trim())
                .emailAddress(dto.getEmailAddress().trim().toLowerCase())
                .customerBirthday(dto.getCustomerBirthday())
                .customerStatus(dto.getCustomerStatus() != null ? dto.getCustomerStatus() : 1)
                .password(passwordEncoder.encode(dto.getPassword()))
                .build();

        customer = customerRepository.save(customer);
        return mapToDTO(customer);
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomer(Integer id, CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        // If email changed, check uniqueness
        if (!customer.getEmailAddress().equalsIgnoreCase(dto.getEmailAddress().trim())) {
            if (customerRepository.existsByEmailAddress(dto.getEmailAddress().trim())) {
                throw new BadRequestException("Email already exists: " + dto.getEmailAddress());
            }
            customer.setEmailAddress(dto.getEmailAddress().trim().toLowerCase());
        }

        customer.setCustomerFullName(dto.getCustomerFullName().trim());
        customer.setTelephone(dto.getTelephone().trim());
        customer.setCustomerBirthday(dto.getCustomerBirthday());
        if (dto.getCustomerStatus() != null) {
            customer.setCustomerStatus(dto.getCustomerStatus());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            customer.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        customer = customerRepository.save(customer);
        return mapToDTO(customer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        // Soft deactivate status to protect transaction history
        customer.setCustomerStatus(0);
        customerRepository.save(customer);
    }
}

