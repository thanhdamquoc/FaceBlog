package com.codegym.faceblog.controller.user;

import com.codegym.faceblog.model.Role;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.role.RoleService;
import com.codegym.faceblog.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @GetMapping
    private ResponseEntity<Iterable<User>> findAll() {
        Iterable<User> users = userService.findAll();
        if (!users.iterator().hasNext()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping
    private ResponseEntity<User> addUser(@RequestBody User user) {
        user.setRole(roleService.findByName("ROLE_USER"));
        return new ResponseEntity<>(userService.save(user), HttpStatus.CREATED);
    }
}
