package com.codegym.faceblog.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    private String content;

    private Date date;
}
