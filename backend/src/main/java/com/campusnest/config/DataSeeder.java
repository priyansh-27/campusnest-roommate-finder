package com.campusnest.config;

import com.campusnest.entity.*;
import com.campusnest.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final AccommodationRepository accRepo;
    private final ExpenseRepository expRepo;
    private final MaintenanceRepository mtRepo;
    private final SoloSeekerRepository soloRepo;
    private final CommunityPostRepository postRepo;
    private final PropertyProofRepository proofRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("✓ Database already has data. Skipping seed.");
            return;
        }

        log.info("🌱 Seeding initial data into Neon Cloud Postgres…");

        // ── Users ─────────────────────────────────────────────────────────
        User admin = userRepo.save(User.builder()
                .name("Admin User").email("admin@campusnest.in")
                .password(encoder.encode("admin123")).phone("+91 98000 00001")
                .role(User.Role.ADMIN)
                .avatar("https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150")
                .build());

        User student = userRepo.save(User.builder()
                .name("Rahul Kumar").email("student@campusnest.in")
                .password(encoder.encode("student123")).phone("+91 98000 00002")
                .role(User.Role.STUDENT)
                .avatar("https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150")
                .build());

        User landlord = userRepo.save(User.builder()
                .name("Rajesh Sharma").email("landlord@campusnest.in")
                .password(encoder.encode("landlord123")).phone("+91 98000 00003")
                .role(User.Role.LANDLORD)
                .avatar("https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150")
                .build());

        userRepo.save(User.builder().name("Priya Mehta").email("priya@campusnest.in")
                .password(encoder.encode("priya123")).phone("+91 99000 00004")
                .role(User.Role.STUDENT)
                .avatar("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150")
                .build());

        User landlord2 = userRepo.save(User.builder().name("Sunita Reddy").email("sunita@campusnest.in")
                .password(encoder.encode("sunita123")).phone("+91 99000 00005")
                .role(User.Role.LANDLORD)
                .avatar("https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150")
                .build());

        userRepo.save(User.builder().name("Ananya Singh").email("ananya@campusnest.in")
                .password(encoder.encode("ananya123")).phone("+91 99000 00006")
                .role(User.Role.STUDENT)
                .avatar("https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150")
                .build());

        log.info("  ✓ Seeded {} users", userRepo.count());

        // ── Accommodations ────────────────────────────────────────────────
        accRepo.save(Accommodation.builder()
                .title("Prestige Heights Premium PG").type(Accommodation.Type.PG)
                .description("Luxury PG with all meals, AC, biometric entry, fast WiFi. Walking distance from main gate.")
                .price(new BigDecimal("12500")).deposit(new BigDecimal("25000"))
                .distanceKm(new BigDecimal("0.4")).safetyScore(98).verified(true).available(true)
                .address("Plot 42, Knowledge Park Avenue, Gate 2").city("Noida")
                .landlordId(landlord.getId()).landlordName(landlord.getName()).landlordPhone(landlord.getPhone())
                .amenities(List.of("AC", "WiFi", "3 Meals", "Power Backup", "Washing Machine", "CCTV", "Biometric Entry"))
                .images(List.of(
                        "https://images.pexels.com/photos/36195702/pexels-photo-36195702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
                        "https://images.pexels.com/photos/6782578/pexels-photo-6782578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"))
                .rating(new BigDecimal("4.8")).reviewsCount(48)
                .build());

        accRepo.save(Accommodation.builder()
                .title("Scholar Nest Co-ed Hostel").type(Accommodation.Type.Hostel)
                .description("Affordable co-ed hostel with study lounge, gym access, and 2 meals daily.")
                .price(new BigDecimal("8500")).deposit(new BigDecimal("10000"))
                .distanceKm(new BigDecimal("1.2")).safetyScore(94).verified(true).available(true)
                .address("Lane 3, University Road, Near Metro").city("Delhi")
                .landlordId(landlord2.getId()).landlordName(landlord2.getName()).landlordPhone(landlord2.getPhone())
                .amenities(List.of("WiFi", "2 Meals", "Gym", "Study Room", "Security", "CCTV"))
                .images(List.of(
                        "https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
                        "https://images.pexels.com/photos/36195703/pexels-photo-36195703.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"))
                .rating(new BigDecimal("4.5")).reviewsCount(32)
                .build());

        accRepo.save(Accommodation.builder()
                .title("GreenView 3BHK Flat Share").type(Accommodation.Type.Flat)
                .description("Spacious 3BHK in gated society with modular kitchen, balcony, parking and smart TV.")
                .price(new BigDecimal("16000")).deposit(new BigDecimal("32000"))
                .distanceKm(new BigDecimal("2.0")).safetyScore(91).verified(true).available(true)
                .address("Apt 402, Tower B, Greenwoods Society").city("Pune")
                .landlordId(landlord.getId()).landlordName(landlord.getName()).landlordPhone(landlord.getPhone())
                .amenities(List.of("AC", "Kitchen", "Parking", "Balcony", "Smart TV", "Power Backup"))
                .images(List.of(
                        "https://images.pexels.com/photos/8089161/pexels-photo-8089161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
                        "https://images.pexels.com/photos/7031708/pexels-photo-7031708.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"))
                .rating(new BigDecimal("4.7")).reviewsCount(19)
                .build());

        accRepo.save(Accommodation.builder()
                .title("NestPro Executive Studio").type(Accommodation.Type.Studio)
                .description("Premium private studio with kitchenette, housekeeping, gigabit internet and keyless entry.")
                .price(new BigDecimal("21000")).deposit(new BigDecimal("40000"))
                .distanceKm(new BigDecimal("0.8")).safetyScore(99).verified(true).available(true)
                .address("Platinum Enclave, 4th Cross, Tech Hub Blvd").city("Bangalore")
                .landlordId(landlord.getId()).landlordName(landlord.getName()).landlordPhone(landlord.getPhone())
                .amenities(List.of("AC", "Kitchenette", "Housekeeping", "Gigabit WiFi", "Keyless Entry", "CCTV"))
                .images(List.of(
                        "https://images.pexels.com/photos/6782578/pexels-photo-6782578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
                        "https://images.pexels.com/photos/36195702/pexels-photo-36195702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"))
                .rating(new BigDecimal("4.9")).reviewsCount(65)
                .build());

        accRepo.save(Accommodation.builder()
                .title("Campus View Budget PG").type(Accommodation.Type.PG)
                .description("Budget-friendly PG with shared rooms, mess facility and 24/7 water supply.")
                .price(new BigDecimal("6500")).deposit(new BigDecimal("8000"))
                .distanceKm(new BigDecimal("0.2")).safetyScore(88).verified(false).available(true)
                .address("House 12, Block C, University Enclave").city("Hyderabad")
                .landlordId(landlord2.getId()).landlordName(landlord2.getName()).landlordPhone(landlord2.getPhone())
                .amenities(List.of("WiFi", "Mess", "Water 24/7", "Security"))
                .images(List.of("https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"))
                .rating(new BigDecimal("4.1")).reviewsCount(22)
                .build());

        log.info("  ✓ Seeded {} accommodations", accRepo.count());

        // ── Expenses ──────────────────────────────────────────────────────
        expRepo.save(Expense.builder().title("Monthly WiFi Fiber").amount(new BigDecimal("1200"))
                .category("Utilities").paidById(student.getId()).paidByName(student.getName())
                .date(LocalDate.now().minusDays(8)).status(Expense.Status.settled)
                .participants(List.of("Rahul Kumar", "Priya Mehta", "Karan Mehta")).build());

        expRepo.save(Expense.builder().title("Grocery Shopping").amount(new BigDecimal("3450"))
                .category("Groceries").paidById(student.getId()).paidByName("Priya Mehta")
                .date(LocalDate.now().minusDays(5)).status(Expense.Status.pending)
                .participants(List.of("Rahul Kumar", "Priya Mehta")).build());

        expRepo.save(Expense.builder().title("Electricity Bill").amount(new BigDecimal("2800"))
                .category("Utilities").paidById(student.getId()).paidByName("Karan Mehta")
                .date(LocalDate.now().minusDays(3)).status(Expense.Status.pending)
                .participants(List.of("Rahul Kumar", "Priya Mehta", "Karan Mehta")).build());

        log.info("  ✓ Seeded {} expenses", expRepo.count());

        // ── Maintenance Requests ──────────────────────────────────────────
        Long firstAccId = accRepo.findAll().get(0).getId();

        mtRepo.save(MaintenanceRequest.builder()
                .tenantId(student.getId()).tenantName(student.getName())
                .propertyId(firstAccId).propertyTitle("Prestige Heights Premium PG")
                .issue("AC not cooling properly").priority(MaintenanceRequest.Priority.high)
                .status(MaintenanceRequest.Status.open).build());

        mtRepo.save(MaintenanceRequest.builder()
                .tenantId(student.getId()).tenantName(student.getName())
                .propertyId(firstAccId).propertyTitle("Prestige Heights Premium PG")
                .issue("Door lock needs replacement").priority(MaintenanceRequest.Priority.low)
                .status(MaintenanceRequest.Status.in_progress).build());

        log.info("  ✓ Seeded {} maintenance requests", mtRepo.count());

        // ── Solo Seekers ──────────────────────────────────────────────────
        soloRepo.save(SoloSeeker.builder()
                .userId(student.getId()).userName("Rahul K.")
                .userAvatar("https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100")
                .flatName("GreenView 3BHK (Gate 2 side)").city("Noida").area("Knowledge Park")
                .rentPerHead(new BigDecimal("5200")).roomsAvailable(1)
                .moveInDate("1st April 2026").stayingSince("Aug 2025")
                .reason("My roommate Kabir got a job in Hyderabad and left suddenly. Looking for one person to fill the room ASAP.")
                .preferences(List.of("Non-smoker", "Vegetarian preferred", "Night Owl ok", "Clean"))
                .verified(true).build());

        log.info("  ✓ Seeded {} solo seeker posts", soloRepo.count());

        // ── Community Posts ───────────────────────────────────────────────
        postRepo.save(CommunityPost.builder()
                .author("Vikram R.").role("Senior Verified Guide")
                .avatar("https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=80")
                .title("🚨 BEWARE: Fake broker scam near University Road")
                .content("If someone asks you to pay a token via QR code before showing the flat — it's a scam! Only use CampusNest verified (blue-badge) landlords.")
                .tags(List.of("Safety Alert", "Scam Warning", "Zero Brokerage"))
                .upvotes(142).replies(List.of("Thanks for the heads up!", "Almost fell for this myself.")).build());

        postRepo.save(CommunityPost.builder()
                .author("Shruti K.").role("Alumni Mentor")
                .avatar("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80")
                .title("💡 How I reduced my PG deposit by 40%")
                .content("Show your CampusNest Trust Score when negotiating! Landlords trust platform-verified students more.")
                .tags(List.of("Financial Hack", "Deposits", "Trust Score"))
                .upvotes(98).replies(List.of("This is gold! Trying it this week.")).build());

        log.info("  ✓ Seeded {} community posts", postRepo.count());

        // ── Property Proofs (sample approved proof for demo landlord) ─────
        proofRepo.save(PropertyProof.builder()
                .landlordId(landlord.getId()).landlordName(landlord.getName())
                .propertyTitle("Prestige Heights Premium PG")
                .proofType(PropertyProof.ProofType.ELECTRICITY_BILL)
                .documentNumber("ELEC-2026-001-NB42")
                .issueDate("2026-02-15")
                .issuingAuthority("Noida Power Company Ltd")
                .fileName("electricity_bill_feb2026.jpg")
                .fileSize(245678L)
                // Tiny base64 placeholder (1x1 transparent png)
                .documentData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=")
                .notes("Electricity bill for Plot 42, Knowledge Park - landlord's name matches property records")
                .status(PropertyProof.Status.approved)
                .reviewedBy("Admin User")
                .reviewedAt(LocalDateTime.now().minusDays(2))
                .reviewNotes("✓ Document verified. Landlord name matches government records.")
                .build());

        log.info("  ✓ Seeded {} property proofs", proofRepo.count());

        log.info("🎉 Seed complete! Demo accounts ready:");
        log.info("    Admin    → admin@campusnest.in / admin123");
        log.info("    Student  → student@campusnest.in / student123");
        log.info("    Landlord → landlord@campusnest.in / landlord123");
    }
}
