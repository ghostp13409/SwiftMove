package com.swiftmove.clientservice;


import com.swiftmove.clientservice.dto.MoveReqPostDto;
import com.swiftmove.clientservice.dto.MoveRequestDTO;
import com.swiftmove.clientservice.dto.UserResponseDTO;
import com.swiftmove.clientservice.feign.UserClient;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.repo.MoveRequestRepo;
import com.swiftmove.clientservice.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static com.swiftmove.clientservice.mapper.MoveRequestMapper.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private UserClient userClient;

    @Mock
    private MoveRequestRepo moveRequestRepo;

    @InjectMocks
    private ClientService clientService;

    private UserResponseDTO user;

    @BeforeEach
    void setUp() {
        user = new UserResponseDTO();
        user.setId(1L);
        user.setRole("CLIENT");
    }

    // ==============================
    // getAllClients
    // ==============================

    @Test
    void getAllClients_success() {
        when(userClient.getAll()).thenReturn(List.of(user));

        List<UserResponseDTO> result = clientService.getAllClients();

        assertEquals(1, result.size());
    }

    // ==============================
    // getClientById
    // ==============================

    @Test
    void getClientById_success() {
        when(userClient.getById(1L)).thenReturn(user);

        UserResponseDTO result = clientService.getClientById(1L);

        assertNotNull(result);
    }

    @Test
    void getClientById_forbidden() {
        user.setRole("DRIVER");
        when(userClient.getById(1L)).thenReturn(user);

        assertThrows(ResponseStatusException.class,
                () -> clientService.getClientById(1L));
    }

    // ==============================
    // addMoveRequest
    // ==============================

    @Test
    void addMoveRequest_success() {

        MoveReqPostDto postDto = new MoveReqPostDto();
        MoveRequest moveRequest = new MoveRequest();

        when(userClient.getById(1L)).thenReturn(user);
        when(moveRequestRepo.save(any(MoveRequest.class)))
                .thenReturn(moveRequest);

        try (MockedStatic<com.swiftmove.clientservice.mapper.MoveRequestMapper> mapper =
                     mockStatic(com.swiftmove.clientservice.mapper.MoveRequestMapper.class)) {

            mapper.when(() -> toMoveRequest(postDto))
                    .thenReturn(moveRequest);

            mapper.when(() -> toDTO(moveRequest))
                    .thenReturn(new MoveRequestDTO());

            MoveRequestDTO result =
                    clientService.addMoveRequest(1L, postDto);

            assertNotNull(result);
            verify(moveRequestRepo).save(any(MoveRequest.class));
        }
    }

    // ==============================
    // getAllActiveMovesClient
    // ==============================

    @Test
    void getAllActiveMovesClient_filtersCorrectly() {

        MoveRequestDTO active = new MoveRequestDTO();
        active.setStatus("PAYMENT_COMPLETED");

        MoveRequestDTO inactive = new MoveRequestDTO();
        inactive.setStatus("CANCELLED");

        ClientService spyService = spy(clientService);

        doReturn(List.of(active, inactive))
                .when(spyService).getAllMovesClient(1L);

        List<MoveRequestDTO> result =
                spyService.getAllActiveMovesClient(1L);

        assertEquals(1, result.size());
    }
}