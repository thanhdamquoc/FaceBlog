package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.DetailedBlog;
import com.codegym.faceblog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Iterable<Blog> findAllByUser(User user);

    @Query(value = "SELECT b.id, b.content, b.user_id AS userId, b.date, " +
            "(SELECT COUNT(*) FROM blog_reaction br WHERE br.blog_id=b.id) AS reactionCount, " +
            "(SELECT COUNT(*) FROM comment c WHERE c.blog_id=b.id) AS commentCount, " +
            "u.username, u.full_name AS fullName, u.profile_picture AS profilePicture " +
            "FROM blog AS b " +
            "JOIN user u on u.id = b.user_id " +
            "ORDER BY b.date DESC LIMIT ?1", nativeQuery = true)
    Iterable<DetailedBlog> findAllDetailedBlogs(int limit);

    @Query(value = "SELECT b.id, b.content, b.user_id AS userId, b.date, " +
            "(SELECT COUNT(*) FROM blog_reaction br WHERE br.blog_id=b.id) AS reactionCount, " +
            "(SELECT COUNT(*) FROM comment c WHERE c.blog_id=b.id) AS commentCount, " +
            "u.username, u.full_name AS fullName, u.profile_picture AS profilePicture " +
            "FROM blog AS b " +
            "JOIN user u on u.id = b.user_id " +
            "WHERE b.user_id = ?1 " +
            "ORDER BY b.date DESC LIMIT ?2", nativeQuery = true)
    Iterable<DetailedBlog> findAllDetailedBlogsByUserId(Long userId, int limit);

}
