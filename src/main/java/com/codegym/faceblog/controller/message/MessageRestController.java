package com.codegym.faceblog.controller.message;

import com.codegym.faceblog.model.Message;
import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.message.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("messages")
public class MessageRestController {
    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> saveMessage(@RequestBody Message message) {
        message.setDate(new Date());
        return new ResponseEntity<>(messageService.save(message), HttpStatus.OK);
    }

    @GetMapping("/user/{senderId}/user/{receiverId}")
    public ResponseEntity<Iterable<Message>> getPrivateMessages(@PathVariable Long senderId, @PathVariable Long receiverId) {
        Iterable<Message> messages = messageService.getPrivateMessages(senderId, receiverId);
        if (!messages.iterator().hasNext()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }


}
