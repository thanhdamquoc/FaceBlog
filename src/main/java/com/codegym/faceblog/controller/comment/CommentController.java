package com.codegym.faceblog.controller.comment;

import com.codegym.faceblog.service.blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/comment")
public class CommentController {
    @Autowired
    BlogService blogService;
}



