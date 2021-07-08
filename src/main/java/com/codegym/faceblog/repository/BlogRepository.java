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

    @Query(value = "select blog.id, blog.content, blog.date, blog.user_id as userId, " +
            "count(blog_reaction.id) as reactionCount, count(comment.id) as commentCount, " +
            "user.username, user.full_name as fullName, user.profile_picture as profilePicture " +
            "from blog left join blog_reaction on blog.id = blog_reaction.blog_id " +
            "left join comment on blog.id = comment.blog_id " +
            "left join user on blog.user_id = user.id " +
            "group by blog.id, blog.date order by blog.date desc limit ?1", nativeQuery = true)
    Iterable<DetailedBlog> findAllDetailedBlogs(int limit);

    @Query(value = "select blog.id, blog.content, blog.date, blog.user_id as userId, " +
            "count(blog_reaction.id) as reactionCount, count(comment.id) as commentCount, " +
            "user.username, user.full_name as fullName, user.profile_picture as profilePicture " +
            "from blog left join blog_reaction on blog.id = blog_reaction.blog_id " +
            "left join comment on blog.id = comment.blog_id " +
            "left join user on blog.user_id = user.id " +
            "where blog.user_id = ?1 " +
            "group by blog.id, blog.date order by blog.date desc limit ?2", nativeQuery = true)
    Iterable<DetailedBlog> findAllDetailedBlogsByUserId(Long userId, int limit);
}
