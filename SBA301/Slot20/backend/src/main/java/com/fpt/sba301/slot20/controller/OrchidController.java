package com.fpt.sba301.slot20.controller;

import com.fpt.sba301.slot20.entity.Orchid;
import com.fpt.sba301.slot20.service.IOrchidService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/orchids", "/api/orchids"})
public class OrchidController {

    private final IOrchidService orchidService;

    public OrchidController(IOrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<Orchid>> getAllOrchids(
            @RequestParam(name = "name", required = false) String name) {
        List<Orchid> result = orchidService.getAllOrchids(name);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getOrchidById(@PathVariable Long id) {
        Orchid orchid = orchidService.getOrchidById(id);
        return ResponseEntity.ok(orchid);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<Orchid> createOrchid(@RequestBody Orchid orchid) {
        Orchid created = orchidService.createOrchid(orchid);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> updateOrchid(
            @PathVariable Long id,
            @RequestBody Orchid orchid) {
        Orchid updated = orchidService.updateOrchid(id, orchid);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable Long id) {
        orchidService.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }
}
