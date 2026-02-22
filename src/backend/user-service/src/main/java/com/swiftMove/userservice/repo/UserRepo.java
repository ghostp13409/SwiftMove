package com.swiftmove.userservice.repo;

import com.swiftmove.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepo extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    // List<User> getAllByRole(String role );

    // Get All Users
    @Query(value = "SELECT * FROM users", nativeQuery = true)
    Iterable<User> getAllUsers();

}
