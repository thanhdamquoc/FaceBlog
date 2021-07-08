package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.BlogReaction;
import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Iterable<Comment> findAllByBlogId(Long id);
}
