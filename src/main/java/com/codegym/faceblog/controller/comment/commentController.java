package com.codegym.faceblog.controller.comment;

import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.service.blog.BlogService;
import com.codegym.faceblog.service.comment.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Optional;

@Controller
@RequestMapping("/comment")
public class commentController {
    @Autowired
    BlogService blogService;
}



