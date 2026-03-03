package com.swiftmove.clientservice.repository;

import com.swiftmove.clientservice.model.LuggageEntry;
import jakarta.ws.rs.QueryParam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LuggageEntryRepository extends JpaRepository<LuggageEntry, Long> {

    List<LuggageEntry> findByMoveRequestId(Long moveRequestId);
}
