package com.codegym.faceblog.service.blog;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.GeneralService;

public interface BlogService extends GeneralService<Blog> {
    Iterable<Blog> findAllByUser(User user);
}
