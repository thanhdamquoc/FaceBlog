package com.codegym.faceblog.service.blogreaction;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.BlogReaction;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.GeneralService;

import java.util.Optional;

public interface BlogReactionService extends GeneralService<BlogReaction> {
    Optional<BlogReaction> findAllByUserAndByBlog(User user, Blog blog);

    Optional<BlogReaction> findByUserIdAndBlogId(Long userId, Long blogId);

    Iterable<BlogReaction> findAllByBlog(Blog blog);
}
