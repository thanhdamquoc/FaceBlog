package com.codegym.faceblog.model.dto;

public interface TopBlog {
    String getContent();
    String getUsername();
    String getFullName();
    int getReactionCount();
    int getCommentCount();
    int getPopularity();
}
