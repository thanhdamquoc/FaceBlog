package com.codegym.faceblog.service.comment;

import com.codegym.faceblog.model.Comment;
import com.codegym.faceblog.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<Comment> findAllByBlog(Pageable pageable, String name) {
        return commentRepository.findAllByBlog(pageable,name);
    }

    @Override
    public Page<Comment> findAllByUser(Pageable pageable, String name) {
        return commentRepository.findAllByUser(pageable,name);
    }
}