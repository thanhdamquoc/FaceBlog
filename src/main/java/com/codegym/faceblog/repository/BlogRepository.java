package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Iterable<Blog> findAllByUser(User user);

    @Query(value = "SELECT b FROM Blog b ORDER BY b.date DESC")
    Iterable<Blog> findAllSorted();

    @Query(value = "SELECT * FROM Blog ORDER BY date DESC LIMIT ?1", nativeQuery = true)
    Iterable<Blog> findAllSortedAndPaged(int limit);
}
