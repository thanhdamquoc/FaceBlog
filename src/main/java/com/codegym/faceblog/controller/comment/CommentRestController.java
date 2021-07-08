package com.codegym.faceblog.controller.comment;

import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.model.security.CurrentUser;
import com.codegym.faceblog.service.comment.CommentService;
import com.codegym.faceblog.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/comment-blog")
public class CommentRestController {

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @GetMapping("/{id}")
    public ResponseEntity<Iterable<Comment>> showListComment(@PathVariable Long id){
        return new ResponseEntity<>(commentService.findAllByBlogId(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Comment> saveComment(@RequestBody Comment comment){
        Object loginUser = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = null;
        if (loginUser instanceof UserDetails) {
            String loginUsername = ((UserDetails) loginUser).getUsername();
            user = userService.findByUsername(loginUsername).get();
        }
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        comment.setUser(user);
        comment.setDate(new Date());
        return new ResponseEntity<>(commentService.save(comment), HttpStatus.CREATED);
    }



}
