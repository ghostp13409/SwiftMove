package com.swiftmove.clientservice;

import com.swiftmove.clientservice.controller.ClientController;
import com.swiftmove.clientservice.dto.MoveReqPostDto;
import com.swiftmove.clientservice.dto.MoveRequestDTO;
import com.swiftmove.clientservice.dto.UserResponseDTO;
import com.swiftmove.clientservice.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientControllerTest {

    @Mock
    private ClientService clientService;

    @InjectMocks
    private ClientController clientController;

    private UserResponseDTO user;
    private MoveRequestDTO move;

    @BeforeEach
    void setUp() {
        user = new UserResponseDTO();
        user.setId(1L);
        user.setRole("CLIENT");

        move = new MoveRequestDTO();
        move.setStatus("PAYMENT_COMPLETED");
    }

    @Test
    void getAllClients_success() {
        when(clientService.getAllClients()).thenReturn(List.of(user));

        ResponseEntity<List<UserResponseDTO>> response =
                clientController.getAllClients();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getClient_success() {
        when(clientService.getClientById(1L)).thenReturn(user);

        ResponseEntity<UserResponseDTO> response =
                clientController.getClient(1L);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    void getHistory_success() {
        when(clientService.getAllMovesClient(1L))
                .thenReturn(List.of(move));

        ResponseEntity<List<MoveRequestDTO>> response =
                clientController.getHistory(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getActiveMoves_success() {
        when(clientService.getAllActiveMovesClient(1L))
                .thenReturn(List.of(move));

        ResponseEntity<List<MoveRequestDTO>> response =
                clientController.getActiveMoves(1L);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void addMoveRequest_success() {
        MoveReqPostDto postDto = new MoveReqPostDto();

        when(clientService.addMoveRequest(1L, postDto))
                .thenReturn(move);

        ResponseEntity<MoveRequestDTO> response =
                clientController.addMoveRequest(1L, postDto);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }
}
