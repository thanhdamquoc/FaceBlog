package com.codegym.faceblog.service.message;

import com.codegym.faceblog.model.Message;
import com.codegym.faceblog.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Override
    public Iterable<Message> findAll() {
        return messageRepository.findAll();
    }

    @Override
    public Optional<Message> findById(Long id) {
        return messageRepository.findById(id);
    }

    @Override
    public Message save(Message message) {
        return messageRepository.save(message);
    }

    @Override
    public void deleteById(Long id) {
        messageRepository.deleteById(id);
    }

    @Override
    public Iterable<Message> getPrivateMessages(Long senderId, Long receiverId) {
        return messageRepository.getPrivateMessages(senderId, receiverId);
    }
}
