package com.swiftMove.clientManagement_service.repo;

import com.swiftMove.clientManagement_service.model.MoveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MoveRequestRepo extends JpaRepository<MoveRequest, Long> {
    List<MoveRequest> getAllMoveRequestsByClientId(Long clientId);

}
