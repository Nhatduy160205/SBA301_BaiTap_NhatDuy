package com.fpt.sba301.slot20.service;

import com.fpt.sba301.slot20.entity.Orchid;
import java.util.List;

public interface IOrchidService {
    List<Orchid> getAllOrchids(String keyword);
    Orchid getOrchidById(Long id);
    Orchid createOrchid(Orchid orchid);
    Orchid updateOrchid(Long id, Orchid orchid);
    void deleteOrchid(Long id);
}
