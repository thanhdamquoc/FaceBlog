package com.codegym.faceblog.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id ;

    @ManyToOne
    User user;

    @ManyToOne
    Blog blog;

    String content;

    Date date;
}