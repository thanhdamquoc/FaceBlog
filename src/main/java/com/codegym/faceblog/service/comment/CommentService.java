package com.codegym.faceblog.service.comment;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.GeneralService;

import java.util.Optional;

public interface CommentService extends GeneralService<Comment> {
    Iterable<Comment> findAllByBlogId(Long id);
}
