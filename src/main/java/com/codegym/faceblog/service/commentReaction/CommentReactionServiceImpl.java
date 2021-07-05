package com.codegym.faceblog.service.commentReaction;

import com.codegym.faceblog.model.CommentReaction;
import com.codegym.faceblog.repository.CommentReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class CommentReactionServiceImpl implements CommentReactionService {
    @Autowired
    CommentReactionRepository commentReactionRepository;

    @Override
    public Iterable<CommentReaction> findAll() {
        return commentReactionRepository.findAll();
    }

    @Override
    public Optional<CommentReaction> findById(Long id) {
        return commentReactionRepository.findById(id);
    }

    @Override
    public CommentReaction save(CommentReaction commentReaction) {
        return commentReactionRepository.save(commentReaction);
    }

    @Override
    public void deleteById(Long id) {
        commentReactionRepository.deleteById(id);
    }
}