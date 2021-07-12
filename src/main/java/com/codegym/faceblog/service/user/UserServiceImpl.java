package com.codegym.faceblog.service.user;

import com.codegym.faceblog.model.User;
import com.codegym.faceblog.model.dto.TopFriend;
import com.codegym.faceblog.model.security.UserDetailsImpl;
import com.codegym.faceblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Iterable<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    @Override
    public User update(User user) {
        return userRepository.save(user);
    }

    @Override
    public Iterable<User> findAllByKeyword(String keyword) {
        keyword = "%" + keyword + "%";
        return userRepository.findAllByKeyword(keyword);
    }

    @Override
    public Iterable<TopFriend> findTopFriendsByUserId(Long userId) {
        return userRepository.findTopFriendsByUserId(userId);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = findByUsername(username);
        if (!userOptional.isPresent()) {
            throw new UsernameNotFoundException(username);
        }
        return UserDetailsImpl.build(userOptional.get());
    }
}
