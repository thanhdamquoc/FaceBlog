package com.codegym.faceblog.controller.reaction;

import com.codegym.faceblog.model.Reaction;
import com.codegym.faceblog.service.reaction.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reactions")
public class ReactionRestController {
    @Autowired
    private ReactionService reactionService;

    @GetMapping
    public ResponseEntity<Iterable<Reaction>> findAll() {
        Iterable<Reaction> reactionIterable = reactionService.findAll();
        if (!reactionIterable.iterator().hasNext()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(reactionIterable, HttpStatus.OK);
    }
}
