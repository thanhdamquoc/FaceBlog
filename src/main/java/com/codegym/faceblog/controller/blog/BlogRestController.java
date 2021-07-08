package com.codegym.faceblog.controller.blog;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.BlogReaction;
import com.codegym.faceblog.model.DetailedBlog;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.blog.BlogService;
import com.codegym.faceblog.service.blogreaction.BlogReactionService;
import com.codegym.faceblog.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/blogs")
public class BlogRestController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private UserService userService;

    @Autowired
    private BlogReactionService blogReactionService;


    @GetMapping("")
    public ResponseEntity<Iterable<Blog>> showListBlog() {
        return new ResponseEntity<>(blogService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/sorted")
    public ResponseEntity<Iterable<DetailedBlog>> showListBlogSorted(@RequestParam int limit) {
        Iterable<DetailedBlog> detailedBlogs = blogService.findAllDetailedBlogs(limit);
        if (!detailedBlogs.iterator().hasNext()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(detailedBlogs, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Blog> saveBlog(@RequestBody Blog blog) {
        Object loginUser = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = null;
        if (loginUser instanceof UserDetails) {
            String loginUsername = ((UserDetails) loginUser).getUsername();
            user = userService.findByUsername(loginUsername).get();
        }
        blog.setUser(user);
        blog.setDate(new Date());
        return new ResponseEntity<>(blogService.save(blog), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Blog>> findBlogById(@PathVariable Long id){
        Optional<Blog> blogOptional = blogService.findById(id);
        if (!blogOptional.isPresent()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(blogOptional, HttpStatus.OK);
    }

    @PostMapping("/{id}")
    public ResponseEntity<Blog> deleteById(@PathVariable Long id){
        Optional<Blog> blogOptional = blogService.findById(id);
        if (!blogOptional.isPresent()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        blogService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{blogId}/blog-reactions")
    public ResponseEntity<Iterable<BlogReaction>> getReactionsByBlogId(@PathVariable Long blogId) {
        Optional<Blog> blogOptional = blogService.findById(blogId);
        if (!blogOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Iterable<BlogReaction> blogReactions = blogReactionService.findAllByBlog(blogOptional.get());
        if (!blogReactions.iterator().hasNext()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(blogReactions, HttpStatus.OK);
    }
}
