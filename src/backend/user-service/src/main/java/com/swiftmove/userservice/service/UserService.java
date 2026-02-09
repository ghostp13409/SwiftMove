package com.swiftmove.userservice.service;

import com.swiftmove.userservice.model.User;
import com.swiftmove.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(String fName, String lName, String email, String username, String passwordHash, java.sql.Date dob, String role) {
//        TODO: Implement Registration Logic properly
        User user = new User();
        user.setFName(fName);
        user.setLName(lName);
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordHash);
        user.setDob(dob);
        user.setRole(role);

        if (isValidUser(user)) {
            return userRepository.save(user);
        } else {
            return null;
        }
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public void updateUser(long id, String fName, String lName, String email, String username, String passwordHash, Date dob, String role) {
//        TODO: Implement Update Logic
    }

    @Override
    public void updateUserByValue(long id, String attribute, String value) {
//        TODO: Implement Update Logic
    }

    @Override
    public boolean deleteUser(long id) {
//        TODO: Implement Delete Logic
        return false;
    }


    private Boolean validateAttribute(String attribute) {
        return List.of("fName", "lName", "email", "username", "passwordHash", "dob", "role").contains(attribute);
    }

    private Boolean isValidUser(User user) {
//        TODO: Implement Validation Logic

        return true;
    }
}
