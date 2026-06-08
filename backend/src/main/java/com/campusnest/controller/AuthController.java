package com.campusnest.controller;

import com.campusnest.dto.AuthDtos.*;
import com.campusnest.entity.User;
import com.campusnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> opt = userRepo.findByEmail(req.getEmail());
        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
        }
        User user = opt.get();
        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
        }
        String token = generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(409).body(new ErrorResponse("Email already registered"));
        }

        User.Role role;
        try {
            role = User.Role.valueOf(req.getRole().toUpperCase());
        } catch (Exception e) {
            role = User.Role.STUDENT;
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(role)
                .avatar("https://ui-avatars.com/api/?name=" + req.getName().replace(" ", "+") + "&background=10b981&color=fff")
                .build();

        user = userRepo.save(user);
        String token = generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    private String generateToken(User user) {
        // Simple token (in production: use JWT)
        return "cn-" + user.getRole().name().toLowerCase() + "-" + user.getId() + "-" + UUID.randomUUID();
    }
}
