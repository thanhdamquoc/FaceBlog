package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query(value = "SELECT m FROM Message m WHERE ((m.sender.id = ?1 AND m.receiver.id = ?2) OR (m.sender.id = ?2 AND m.receiver.id = ?1)) ORDER BY m.date ASC")
    Iterable<Message> getPrivateMessages(Long senderId, Long receiverId);

}
