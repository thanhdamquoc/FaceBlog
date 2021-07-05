package com.codegym.faceblog.controller.blog;

import com.codegym.faceblog.service.blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class BlogController {
    @Autowired
    private BlogService blogService;

    @GetMapping
    public ModelAndView showIndex() {
        ModelAndView modelAndView = new ModelAndView("index");
        modelAndView.addObject("blogs", blogService.findAll());
        return modelAndView;
    }
}
