package com.swiftmove.userservice.service;

import com.swiftmove.userservice.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IUserService {

    User registerUser(String fName, String lName, String email, String username, String passwordHash, java.sql.Date dob, String role);
    List<User> getAllUsers();
    User getUserById(long id);
    User getUserByEmail(String email);
    User getUserByUsername(String username);
    void updateUser(long id, String fName, String lName, String email, String username, String passwordHash, java.sql.Date dob, String role);
    void updateUserByValue(long id, String attribute, String value);
    boolean deleteUser(long id);
}
