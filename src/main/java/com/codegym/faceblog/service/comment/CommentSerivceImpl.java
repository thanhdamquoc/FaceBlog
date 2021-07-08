package com.codegym.faceblog.service.comment;

import com.codegym.faceblog.model.Blog;
import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class CommentSerivceImpl implements CommentService {
    @Autowired
    CommentRepository commentRepository;

    @Override
    public Iterable<Comment> findAll() {
        return commentRepository.findAll();
    }

    @Override
    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    @Override
    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }

    @Override
    public Iterable<Comment> findAllByBlogId(Long id) {
        return commentRepository.findAllByBlogId(id);
    }
}