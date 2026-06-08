package com.campusnest.dto;

import com.campusnest.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDtos {

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String role; // "student" | "landlord" | "admin"
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private User user;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ErrorResponse {
        private String message;
    }
}
