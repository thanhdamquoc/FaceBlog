package com.codegym.faceblog.service.user;

import com.codegym.faceblog.model.User;
import com.codegym.faceblog.model.dto.TopFriend;
import com.codegym.faceblog.service.GeneralService;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface UserService extends GeneralService<User>, UserDetailsService {
    Optional<User> findByUsername(String username);

    User update(User user);

    Iterable<User> findAllByKeyword(String keyword);

    Iterable<TopFriend> findTopFriendsByUserId(Long userId);
}
