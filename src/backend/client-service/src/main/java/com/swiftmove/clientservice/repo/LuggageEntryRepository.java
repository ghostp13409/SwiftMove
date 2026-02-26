package com.swiftmove.clientservice.repo;

import com.swiftmove.clientservice.model.LuggageEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LuggageEntryRepository extends JpaRepository<LuggageEntry, Long> {
}
