package com.swiftmove.clientservice.repository;

import com.swiftmove.clientservice.model.LuggageType;
import com.swiftmove.clientservice.model.LuggageTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LuggageTypeRepository extends JpaRepository<LuggageType, Long> {
        LuggageType findLuggageTypeByType(LuggageTypeEnum type);
}
