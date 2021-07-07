package com.codegym.faceblog.controller.message;

import com.codegym.faceblog.model.Message;
import com.codegym.faceblog.service.message.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
