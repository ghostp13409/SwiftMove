package com.swiftmove.clientservice.repo;

import com.swiftmove.clientservice.model.LuggageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LuggageTypeRepository extends JpaRepository<LuggageType, Long> {
}
