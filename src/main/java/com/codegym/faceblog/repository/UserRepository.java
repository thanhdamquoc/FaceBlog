package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query(value = "select * from user u where u.username like ?1 or u.full_name like  ?1 limit 5", nativeQuery = true)
    Iterable<User> findAllByKeyword(String keyword);
}
