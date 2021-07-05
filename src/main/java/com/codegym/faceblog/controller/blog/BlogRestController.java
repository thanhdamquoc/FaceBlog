package com.codegym.faceblog.controller.blog;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.service.blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/blogs")
public class BlogRestController {

    @Autowired
    private BlogService blogService;

    @GetMapping("")
    public ResponseEntity<Iterable<Blog>> showListBlog(){
        return new ResponseEntity<>(blogService.findAll(), HttpStatus.OK);
    }
}
