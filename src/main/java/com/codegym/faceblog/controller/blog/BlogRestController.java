package com.codegym.faceblog.controller.blog;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.blog.BlogService;
import com.codegym.faceblog.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/blogs")
public class BlogRestController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private UserService userService;


    @GetMapping("")
    public ResponseEntity<Iterable<Blog>> showListBlog() {
        return new ResponseEntity<>(blogService.findAll(), HttpStatus.OK);
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

}
