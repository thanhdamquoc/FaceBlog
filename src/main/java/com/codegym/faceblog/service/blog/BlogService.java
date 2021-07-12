package com.codegym.faceblog.service.blog;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.dto.DetailedBlog;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.model.dto.TopBlog;
import com.codegym.faceblog.service.GeneralService;

public interface BlogService extends GeneralService<Blog> {
    Iterable<Blog> findAllByUser(User user);

    Iterable<DetailedBlog> findAllDetailedBlogs(int limit);

    Iterable<DetailedBlog> findAllDetailedBlogsByUserId(Long userId, int limit);

    Iterable<TopBlog> findTopBlogs();

    Iterable<Blog> findAllByContentContains(String keyword);
}
