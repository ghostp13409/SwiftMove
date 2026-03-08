package com.swiftMove.userservice.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swiftMove.userservice.model.User;

public interface UserRepo extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
    Optional<User> findByEmail(String email);

    // Get All Users
    @Query(value = "SELECT * FROM users", nativeQuery = true)
    Iterable<User> getAllUsers();

}
