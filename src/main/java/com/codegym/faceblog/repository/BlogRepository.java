package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Iterable<Blog> findAllByUser(User user);
}
