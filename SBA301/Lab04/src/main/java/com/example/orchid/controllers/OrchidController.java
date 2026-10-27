package com.example.orchid.controllers;

import com.example.orchid.pojos.Orchid;
import com.example.orchid.services.IOrchidService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/orchids", "/orchids"})
@CrossOrigin(origins = "*")
public class OrchidController {

    private final IOrchidService orchidService;

    public OrchidController(IOrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping
    public ResponseEntity<List<Orchid>> getAll(@RequestParam(required = false) String name) {
        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(orchidService.searchByName(name));
        }
        return ResponseEntity.ok(orchidService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getById(@PathVariable Long id) {
        return orchidService.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Orchid> create(@RequestBody Orchid orchid) {
        Orchid created = orchidService.create(orchid);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> update(@PathVariable Long id, @RequestBody Orchid orchid) {
        return orchidService.update(id, orchid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = orchidService.delete(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
