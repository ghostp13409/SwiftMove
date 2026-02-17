package com.swiftMove.user_service.repo;

import com.swiftMove.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
   // @Query(value = "SELECT * FROM users WHERE email = :email",nativeQuery = true)
   // Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);


}
