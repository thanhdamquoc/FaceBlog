package com.codegym.faceblog.controller.blogreaction;

import com.codegym.faceblog.model.BlogReaction;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.blogreaction.BlogReactionService;
import com.codegym.faceblog.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/blog-reactions")
public class BlogReactionRestController {
    @Autowired
    private BlogReactionService blogReactionService;

    @Autowired
    private UserService userService;

    @PostMapping
    private ResponseEntity<BlogReaction> saveBlogReaction(@RequestBody BlogReaction blogReaction) {
        //set user of blog reaction as current logged in user
        Object loginUser = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = null;
        if (loginUser instanceof UserDetails) {
            String loginUsername = ((UserDetails) loginUser).getUsername();
            user = userService.findByUsername(loginUsername).get();
        }
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        blogReaction.setUser(user);
        //if this user has reacted to this blog before, overwrite last reaction
        Optional<BlogReaction> blogReactionOptional = blogReactionService.findAllByUserAndByBlog(user, blogReaction.getBlog());
        if (blogReactionOptional.isPresent()) {
            Long lastReactionId = blogReactionOptional.get().getReaction().getId();
            Long newReactionId = blogReaction.getReaction().getId();
            blogReaction.setId(blogReactionOptional.get().getId());
            //clicking on the same reaction as you reacted before removes that reaction
            if (lastReactionId == newReactionId) {
                blogReactionService.deleteById(blogReaction.getId());
                return new ResponseEntity<>(blogReactionOptional.get(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(blogReactionService.save(blogReaction), HttpStatus.OK);
    }
}
