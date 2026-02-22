package com.swiftmove.clientservice.repo;

import com.swiftmove.clientservice.model.MoveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MoveRequestRepo extends JpaRepository<MoveRequest, Long> {
    List<MoveRequest> getAllMoveRequestsByClientId(Long clientId);

}
