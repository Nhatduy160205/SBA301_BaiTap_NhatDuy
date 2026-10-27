package com.fpt.sba301.slot26.service;

import com.fpt.sba301.slot26.dto.Dtos.*;
import com.fpt.sba301.slot26.entity.Orchid;
import com.fpt.sba301.slot26.repository.OrchidRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrchidService {

    private final OrchidRepository orchidRepository;

    public OrchidService(OrchidRepository orchidRepository) {
        this.orchidRepository = orchidRepository;
    }

    @Transactional(readOnly = true)
    public List<OrchidResponse> findAll() {
        return orchidRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrchidResponse findById(int id) {
        Orchid o = orchidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found with id: " + id));
        return toResponse(o);
    }

    @Transactional
    public OrchidResponse create(OrchidRequest req) {
        // Business logic / validation in Service
        Orchid o = new Orchid();
        copyProperties(o, req);
        Orchid saved = orchidRepository.save(o);
        return toResponse(saved);
    }

    @Transactional
    public OrchidResponse update(int id, OrchidRequest req) {
        // Business dirty-checking in Service
        Orchid o = orchidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found with id: " + id));
        copyProperties(o, req);
        Orchid updated = orchidRepository.save(o);
        return toResponse(updated);
    }

    @Transactional
    public void delete(int id) {
        // Business pre-condition in Service
        Orchid o = orchidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found with id: " + id));
        orchidRepository.delete(o);
    }

    private void copyProperties(Orchid o, OrchidRequest req) {
        o.setOrchidName(req.orchidName().trim());
        o.setIsNatural(req.isNatural() != null ? req.isNatural() : Boolean.TRUE);
        o.setOrchidDescription(req.orchidDescription());
        o.setOrchidCategory(req.orchidCategory());
        o.setIsAttractive(req.isAttractive() != null ? req.isAttractive() : Boolean.FALSE);
        o.setOrchidURL(req.orchidURL());
    }

    private OrchidResponse toResponse(Orchid o) {
        return new OrchidResponse(
                o.getOrchidId(),
                o.getOrchidName(),
                o.getIsNatural(),
                o.getOrchidDescription(),
                o.getOrchidCategory(),
                o.getIsAttractive(),
                o.getOrchidURL()
        );
    }
}