package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findAllByBlog(Pageable pageable,String name);
    Page<Comment> findAllByUser(Pageable pageable,String name);
}
