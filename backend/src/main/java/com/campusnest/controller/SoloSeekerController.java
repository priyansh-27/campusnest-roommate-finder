package com.campusnest.controller;

import com.campusnest.entity.SoloSeeker;
import com.campusnest.repository.SoloSeekerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/solo-seekers")
@RequiredArgsConstructor
public class SoloSeekerController {

    private final SoloSeekerRepository repo;

    @GetMapping
    public List<SoloSeeker> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public SoloSeeker create(@RequestBody SoloSeeker seeker) {
        if (seeker.getVerified() == null) seeker.setVerified(true);
        return repo.save(seeker);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
