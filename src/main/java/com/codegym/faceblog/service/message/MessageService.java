package com.codegym.faceblog.service.message;

import com.codegym.faceblog.model.Message;
import com.codegym.faceblog.service.GeneralService;

public interface MessageService extends GeneralService<Message> {
    Iterable<Message> getPrivateMessages(Long senderId, Long receiverId);
}
