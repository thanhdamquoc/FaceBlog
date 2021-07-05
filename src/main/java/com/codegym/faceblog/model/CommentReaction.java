package com.codegym.faceblog.model;

import javax.persistence.*;

@Entity
public class CommentReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    @ManyToOne
    User user;

    @ManyToOne
    Comment comment;

    @ManyToOne
    Reaction reaction;
}