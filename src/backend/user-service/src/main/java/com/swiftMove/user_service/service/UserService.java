package com.swiftMove.user_service.service;

import com.swiftMove.user_service.dto.UserRequestDTO;
import com.swiftMove.user_service.dto.UserResponseDTO;
import com.swiftMove.user_service.mapper.UserMapper;
import com.swiftMove.user_service.model.User;
import com.swiftMove.user_service.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
   private final PasswordEncoder passwordEncoder;

   //For Adding a new user
    public UserResponseDTO addNewUser(UserRequestDTO dto){
        // User email must be unique
       if (userRepo.existsByEmail(dto.getEmail()))
           throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");


       User user = UserMapper.createUserFromDto(dto);

       //Bcrypt Hashing
       user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        // TODO: REMOVE THIS FOR PROD
        // IMPORTANT JUST SETTING FOR TESTING PURPOSE ROLE
       user.setRole("CLIENT");
       user.setCreatedAt(LocalDate.now());
       user.setUpdatedAt(LocalDate.now());;

       User savedUser = userRepo.save(user);
       return UserMapper.userToResponseDto(savedUser);


    }

    //Get All Users
    public List<UserResponseDTO> findAll(){
        return userRepo.findAll().stream().map(UserMapper::userToResponseDto).toList();
    }

    //GetByID
    public  UserResponseDTO findById(long id){
        User user = userRepo.findById(id)
                .orElseThrow(()->new ResponseStatusException
                        (HttpStatus.NOT_FOUND));

        return UserMapper.userToResponseDto(user);
    }

    //Update user
    public UserResponseDTO updateExistingUser(long userId, UserRequestDTO dto){
        User existingUser=userRepo.findById(userId)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));

        UserMapper.updateEntity(existingUser, dto);

        // only and only if the user wants to change the password
        if (dto.getPassword()!=null&&!dto.getPassword().isBlank())
            existingUser.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        existingUser.setUpdatedAt(LocalDate.now());
        User savedUser = userRepo.save(existingUser);
        return UserMapper.userToResponseDto(savedUser);

    }

    public void deleteUser(Long id){

        if(!userRepo.existsById(id)){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found");
        }

        userRepo.deleteById(id);
    }
}
