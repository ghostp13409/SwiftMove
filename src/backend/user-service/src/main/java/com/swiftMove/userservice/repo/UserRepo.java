package com.swiftmove.userservice.repo;

import com.swiftmove.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
    Optional<User> findByEmail(String email);

    // Get All Users
    @Query(value = "SELECT * FROM users", nativeQuery = true)
    Iterable<User> getAllUsers();

}
