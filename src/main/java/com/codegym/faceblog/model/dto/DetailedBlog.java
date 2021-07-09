package com.codegym.faceblog.model.dto;

import java.util.Date;

public interface DetailedBlog {
    Long getId();
    String getContent();
    Long getUserId();
    Date getDate();
    int getReactionCount();
    int getCommentCount();
    String getUsername();
    String getFullName();
    String getProfilePicture();
}
