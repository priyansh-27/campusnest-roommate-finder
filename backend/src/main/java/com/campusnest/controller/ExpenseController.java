package com.campusnest.controller;

import com.campusnest.entity.Expense;
import com.campusnest.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseRepository repo;

    @GetMapping
    public List<Expense> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public Expense create(@RequestBody Expense exp) {
        if (exp.getStatus() == null) exp.setStatus(Expense.Status.pending);
        if (exp.getParticipants() != null && !exp.getParticipants().isEmpty() && exp.getAmount() != null) {
            exp.setSplitAmount(
                exp.getAmount().divide(BigDecimal.valueOf(exp.getParticipants().size()), 2, RoundingMode.HALF_UP)
            );
        }
        return repo.save(exp);
    }

    @PutMapping("/{id}/settle")
    public ResponseEntity<Expense> settle(@PathVariable Long id) {
        return repo.findById(id).map(e -> {
            e.setStatus(Expense.Status.settled);
            return ResponseEntity.ok(repo.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
