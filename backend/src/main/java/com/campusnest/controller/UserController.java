package com.campusnest.controller;

import com.campusnest.entity.User;
import com.campusnest.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;
    private final AccommodationRepository accRepo;
    private final ExpenseRepository expRepo;
    private final MaintenanceRepository mtRepo;

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> map = new HashMap<>();
        map.put("status", "UP");
        map.put("service", "CampusNest Backend");
        map.put("database", "Neon Cloud PostgreSQL");
        map.put("timestamp", System.currentTimeMillis());
        return map;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalListings",        accRepo.count());
        stats.put("totalStudents",        userRepo.countByRole(User.Role.STUDENT));
        stats.put("totalLandlords",       userRepo.countByRole(User.Role.LANDLORD));
        stats.put("pendingVerifications", accRepo.countByVerifiedFalse());
        stats.put("monthlyRevenue",       284500);
        stats.put("activeBookings",       3);
        stats.put("totalExpenses",        expRepo.count());
        stats.put("pendingExpenses",      expRepo.countByStatus(com.campusnest.entity.Expense.Status.pending));
        stats.put("activeRequests",       mtRepo.count() - mtRepo.countByStatus(com.campusnest.entity.MaintenanceRequest.Status.resolved));
        stats.put("roommateMatches",      4);
        return stats;
    }
}
