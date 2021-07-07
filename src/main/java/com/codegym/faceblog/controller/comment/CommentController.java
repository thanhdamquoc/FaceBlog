package com.codegym.faceblog.controller.comment;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.blog.BlogService;
import com.codegym.faceblog.service.comment.CommentService;
import com.codegym.faceblog.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.xml.transform.OutputKeys;
import java.util.Optional;

@RestController
@RequestMapping("/comment")
public class CommentController {
    @Autowired
    BlogService blogService;
    @Autowired
    CommentService commentService;
    @Autowired
    UserService userService;

    @GetMapping("/commentList")
    public ResponseEntity<?> listComment(){
        return new ResponseEntity<>(commentService.findAll(),HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment){
        return new ResponseEntity<>(commentService.save(comment), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment comment){
        Optional<Comment> commentOptional = commentService.findById(id);
        if(!commentOptional.isPresent()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        comment.setId(commentOptional.get().getId());
        return new ResponseEntity<>(commentService.save(comment),HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Comment> deleteComment(@PathVariable Long id, @RequestBody Comment comment){
        Optional<Comment> commentOptional = commentService.findById(id);
        if(!commentOptional.isPresent()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        commentService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Comment> findById(@PathVariable Long id){
        try{
            Optional<Comment> commentOptional = commentService.findById(id);
            if(!commentOptional.isPresent()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(commentOptional.get(),HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}



