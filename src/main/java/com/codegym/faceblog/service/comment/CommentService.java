package com.codegym.faceblog.service.comment;

import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.service.GeneralService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService extends GeneralService<Comment> {
    Page<Comment> findAllByBlog(Pageable pageable, String name);

    Page<Comment> findAllByUser(Pageable pageable, String name);
}
