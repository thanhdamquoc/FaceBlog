package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.BlogReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogReactionRepository extends JpaRepository<BlogReaction, Long> {
}
