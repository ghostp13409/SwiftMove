package com.swiftmove.userservice.repo;

import com.swiftmove.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Long> {

    boolean existsByEmail(String email);
    //List<User> getAllByRole(String role );
}
