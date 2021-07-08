package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.BlogReaction;
import com.codegym.faceblog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogReactionRepository extends JpaRepository<BlogReaction, Long> {
    @Query(value = "SELECT b FROM BlogReaction b WHERE b.user = ?1 AND b.blog = ?2")
    Optional<BlogReaction> findAllByUserAndByBlog(User user, Blog blog);

    @Query(value = "SELECT b FROM BlogReaction b WHERE b.user.id = ?1 AND b.blog.id = ?2")
    Optional<BlogReaction> findByUserIdAndBlogId(Long userId, Long blogId);

    Iterable<BlogReaction> findAllByBlog(Blog blog);
}
