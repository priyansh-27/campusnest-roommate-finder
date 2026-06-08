package com.campusnest.repository;

import com.campusnest.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByOrderByCreatedAtDesc();
    long countByStatus(Expense.Status status);
}
