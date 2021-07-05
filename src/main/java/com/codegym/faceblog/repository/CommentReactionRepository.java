package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.CommentReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {

}
