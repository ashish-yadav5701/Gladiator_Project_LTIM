package com.wecp.eventmanagementsystem.service;


import com.wecp.eventmanagementsystem.config.UserInfoUserDetails;
import com.wecp.eventmanagementsystem.entity.User;
import com.wecp.eventmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    private UserRepository userRepository;


    //register user if username already exist then return null
    public User registerUser(User user) {
      Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
      if (existingUser.isPresent()) {
        return null; 
      } else {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
      }
    }

    // get user by username
    public User getUserByUsername(String username) {
      return userRepository.findByUsername(username).get();
    }

    public List<User> getAllUser(){
      return (List<User>) userRepository.findAll();
    }

    //update the user
    public User updateUser(Long userId, User user){
      user.setPassword(encoder.encode(user.getPassword()));
      return userRepository.save(user);
    }

    // load UserDetails by username
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(UserInfoUserDetails::new)
                    .orElseThrow(() -> new UsernameNotFoundException("user not found " + username));
    }
}
