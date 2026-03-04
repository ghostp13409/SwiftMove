package com.swiftmove.clientservice.service;

import com.swiftmove.clientservice.dto.AddLuggageEntryDto;
import com.swiftmove.clientservice.dto.UpdateLuggageEntryDto;
import com.swiftmove.clientservice.mapper.Mapper;
import com.swiftmove.clientservice.model.LuggageEntry;
import com.swiftmove.clientservice.model.LuggageType;
import com.swiftmove.clientservice.model.LuggageTypeEnum;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.repository.LuggageEntryRepository;
import com.swiftmove.clientservice.repository.LuggageTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LuggageService {
    private final LuggageEntryRepository luggageEntryRepository;
    private final MoveRequestService moveRequestService;
    private final LuggageTypeRepository luggageTypeRepository;

    public List<LuggageEntry> getByMoveRequestId(Long moveRequestId){
        return luggageEntryRepository.findByMoveRequestId(moveRequestId);
    }

    public List<LuggageEntry> getAll(){
        return luggageEntryRepository.findAll();
    }

    public LuggageEntry getLuggageEntryById(Long id){
        return luggageEntryRepository.findById(id).orElse(null);
    }

    public LuggageEntry addLuggageEntry(Long moverequestId, AddLuggageEntryDto luggageEntryDto){

        Optional<LuggageEntry> existingEntry = luggageEntryRepository.findById(luggageEntryDto.getId());
        if(existingEntry.isPresent()){
            LuggageEntry entry = existingEntry.get();
            entry.setQuantity(entry.getQuantity() + luggageEntryDto.getQuantity());

            return luggageEntryRepository.save(entry);
        }
        else {
            MoveRequest moveRequest = moveRequestService.findById(moverequestId);
            LuggageEntry newLuggageEntry = Mapper.toLuggageEntryEntity(luggageEntryDto);
            newLuggageEntry.setMoveRequest(moveRequest);
            newLuggageEntry.setLuggageType(luggageTypeRepository.findLuggageTypeByType(luggageEntryDto.getLuggageType()));
            return luggageEntryRepository.save(newLuggageEntry);
        }
    }

    public LuggageEntry updateLuggageEntry(Long luggageEntryId, UpdateLuggageEntryDto luggageEntryDto){
        Optional<LuggageEntry> existingEntry = luggageEntryRepository.findById(luggageEntryId);
         if(existingEntry.isPresent()){
             LuggageEntry entryToUpdate = existingEntry.get();
             entryToUpdate.setQuantity(luggageEntryDto.getQuantity());
             return luggageEntryRepository.save(entryToUpdate);
         } else {
             return null;
         }
    }
    public void deleteLuggageEntry(Long id){
        luggageEntryRepository.deleteById(id);
    }
    public void deleteAllLuggageEntries(Long moveRequestId){
        List<LuggageEntry> luggageEntries = luggageEntryRepository.findByMoveRequestId(moveRequestId);
        luggageEntryRepository.deleteAll(luggageEntries);
    }
    public List<LuggageType> getAllTypes(){
        return luggageTypeRepository.findAll();
    }
    private LuggageType getLuggageTypeByEnum(LuggageTypeEnum luggageTypeEnum){
        return luggageTypeRepository.findLuggageTypeByType(luggageTypeEnum);
    }
}
