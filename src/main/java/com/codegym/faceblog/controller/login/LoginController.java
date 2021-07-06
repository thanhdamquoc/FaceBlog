package com.codegym.faceblog.controller.login;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/login")
public class LoginController {

    @GetMapping
    public String showLoginPage() {
        return "/login";
    }

    @GetMapping("/signup")
    public String showSignUpPage() {
        return "/signup";
    }

}
