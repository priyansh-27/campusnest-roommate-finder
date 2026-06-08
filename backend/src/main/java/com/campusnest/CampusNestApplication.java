package com.campusnest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusNestApplication {

    public static void main(String[] args) {
        System.out.println("\n  🪺 Starting CampusNest Backend...");
        System.out.println("  📡 Connecting to Neon Cloud PostgreSQL...\n");

        SpringApplication.run(CampusNestApplication.class, args);

        System.out.println("\n  ✅ CampusNest Backend READY!");
        System.out.println("  🌐 API:      http://localhost:8080/api/v1");
        System.out.println("  🔍 Health:   http://localhost:8080/api/v1/health");
        System.out.println("  📊 Listings: http://localhost:8080/api/v1/accommodations");
        System.out.println("  ⚛️  Frontend: http://localhost:5173\n");
    }
}
