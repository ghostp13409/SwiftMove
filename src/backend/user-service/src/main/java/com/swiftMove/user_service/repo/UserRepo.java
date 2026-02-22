package com.swiftMove.user_service.repo;

import com.swiftMove.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {

    boolean existsByEmail(String email);
    //List<User> getAllByRole(String role );
}
