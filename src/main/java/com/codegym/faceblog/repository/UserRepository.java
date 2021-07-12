package com.codegym.faceblog.repository;

import com.codegym.faceblog.model.User;
import com.codegym.faceblog.model.dto.TopFriend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query(value = "select * from user u where u.username like ?1 or u.full_name like  ?1 limit 3", nativeQuery = true)
    Iterable<User> findAllByKeyword(String keyword);

    @Query(value = "select u.id, u.username, u.full_name as fullName, u.profile_picture as profilePicture, " +
            "(select count(*) from message m where (m.receiver_id = u.id and m.sender_id = ?1) " +
            "or (m.receiver_id = ?1 and m.sender_id = u.id)) as messagesExchanged " +
            "from user u " +
            "order by messagesExchanged desc " +
            "limit 5", nativeQuery = true)
    Iterable<TopFriend> findTopFriendsByUserId(Long userId);
}
