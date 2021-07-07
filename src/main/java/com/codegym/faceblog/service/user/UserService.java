package com.codegym.faceblog.service.user;

import com.codegym.faceblog.model.User;
import com.codegym.faceblog.service.GeneralService;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface UserService extends GeneralService<User>, UserDetailsService {
    Optional<User> findByUsername(String username);

    public User update(User user);
}
