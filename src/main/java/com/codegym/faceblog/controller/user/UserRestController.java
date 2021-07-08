package com.codegym.faceblog.controller.user;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.BlogReaction;
import com.codegym.faceblog.model.Role;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.blog.BlogService;
import com.codegym.faceblog.service.blogreaction.BlogReactionService;
import com.codegym.faceblog.service.role.RoleService;
import com.codegym.faceblog.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private BlogReactionService blogReactionService;

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

    @GetMapping("/{id}")
    private ResponseEntity<User> findById(@PathVariable Long id) {
        Optional<User> userOptional = userService.findById(id);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userOptional.get(), HttpStatus.OK);
    }

    @PostMapping("/{id}")
    private ResponseEntity<User> editUser(@RequestBody User user) {
        Optional<User> userOptional = userService.findById(user.getId());
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userOptional.get().setFullName(user.getFullName());
        userOptional.get().setProfilePicture(user.getProfilePicture());
        if (user.getPassword() != "") {
            userOptional.get().setPassword(user.getPassword());
        }
        return new ResponseEntity<>(userService.update(userOptional.get()),HttpStatus.OK);
    }

    @GetMapping("/{id}/blogs")
    private ResponseEntity<Iterable<Blog>> findBlogsByUserId(@PathVariable Long id) {
        Optional<User> userOptional = userService.findById(id);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Iterable<Blog> blogs = blogService.findAllByUser(userOptional.get());
        if (!blogs.iterator().hasNext()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }

    @GetMapping("/{userId}/blogs/{blogId}/blog-reactions")
    private ResponseEntity<BlogReaction> findBlogReactionsByUserIdAndBlogId(@PathVariable Long userId, @PathVariable Long blogId) {
        Optional<BlogReaction> blogReactionOptional = blogReactionService.findByUserIdAndBlogId(userId, blogId);
        if (!blogReactionOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(blogReactionOptional.get(), HttpStatus.OK);
    }
}
