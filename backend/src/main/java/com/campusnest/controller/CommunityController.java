package com.campusnest.controller;

import com.campusnest.entity.CommunityPost;
import com.campusnest.repository.CommunityPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityPostRepository repo;

    @GetMapping("/posts")
    public List<CommunityPost> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/posts")
    public CommunityPost create(@RequestBody CommunityPost post) {
        if (post.getUpvotes() == null) post.setUpvotes(0);
        if (post.getReplies() == null) post.setReplies(new ArrayList<>());
        return repo.save(post);
    }

    @PutMapping("/posts/{id}/upvote")
    public ResponseEntity<CommunityPost> upvote(@PathVariable Long id) {
        return repo.findById(id).map(p -> {
            p.setUpvotes(p.getUpvotes() + 1);
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/posts/{id}/reply")
    public ResponseEntity<CommunityPost> reply(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repo.findById(id).map(p -> {
            List<String> replies = p.getReplies();
            if (replies == null) replies = new ArrayList<>();
            replies.add(body.get("text"));
            p.setReplies(replies);
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }
}
