package com.codegym.faceblog.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class BlogReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Blog blog;

    @ManyToOne
    private Reaction reaction;
}
