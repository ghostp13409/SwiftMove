package com.swiftmove.clientservice;


import com.swiftmove.clientservice.controller.MoveRequestController;
import com.swiftmove.clientservice.dto.MoveReqPostDto;
import com.swiftmove.clientservice.dto.MoveRequestDTO;
import com.swiftmove.clientservice.service.MoveRequestService;
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
class MoveRequestControllerTest {

    @Mock
    private MoveRequestService moveRequestService;

    @InjectMocks
    private MoveRequestController moveRequestController;

    private MoveRequestDTO dto;

    @BeforeEach
    void setUp() {
        dto = new MoveRequestDTO();
        dto.setStatus("PENDING");
    }

    @Test
    void getAllMoveRequest_success() {
        when(moveRequestService.getAllMoveRequest())
                .thenReturn(List.of(dto));

        ResponseEntity<List<MoveRequestDTO>> response =
                moveRequestController.getAllMoveRequest();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getMoveRequestById_success() {
        when(moveRequestService.getMoveRequestById(1L))
                .thenReturn(dto);

        ResponseEntity<MoveRequestDTO> response =
                moveRequestController.getMoveRequestById(1L);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    void addNewMoveRequest_success() {
        MoveReqPostDto postDto = new MoveReqPostDto();

        ResponseEntity<Void> response =
                moveRequestController.addNewMoveRequest(postDto);

        assertEquals(200, response.getStatusCode().value());
        verify(moveRequestService).addMoveRequest(postDto);
    }

    @Test
    void deleteMoveRequest_success() {
        ResponseEntity<Void> response =
                moveRequestController.deleteMoveRequest(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(moveRequestService).deleteMoveRequest(1L);
    }

    @Test
    void editMoveRequest_success() {
        MoveReqPostDto postDto = new MoveReqPostDto();

        when(moveRequestService.updateMoveRequest(1L, postDto))
                .thenReturn(dto);

        ResponseEntity<MoveRequestDTO> response =
                moveRequestController.editMoveRequest(1L, postDto);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }
}
