package com.swiftmove.clientservice.repository;

import com.swiftmove.clientservice.model.MoveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoveRequestRepository extends JpaRepository<MoveRequest, Long> {
    List<MoveRequest> findByClientId(Long clientId);


}
