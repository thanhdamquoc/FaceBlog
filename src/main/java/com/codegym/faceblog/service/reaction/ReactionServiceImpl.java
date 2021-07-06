package com.codegym.faceblog.service.reaction;

import com.codegym.faceblog.model.Reaction;
import com.codegym.faceblog.repository.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReactionServiceImpl implements ReactionService{
    @Autowired
    private ReactionRepository reactionRepository;

    @Override
    public Iterable<Reaction> findAll() {
        return reactionRepository.findAll();
    }

    @Override
    public Optional<Reaction> findById(Long id) {
        return reactionRepository.findById(id);
    }

    @Override
    public Reaction save(Reaction reaction) {
        return reactionRepository.save(reaction);
    }

    @Override
    public void deleteById(Long id) {
        reactionRepository.deleteById(id);
    }
}
