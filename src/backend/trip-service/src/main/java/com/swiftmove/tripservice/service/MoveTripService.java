package com.swiftmove.tripservice.service;

import com.swiftmove.tripservice.repository.MoveTripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MoveTripService {

    private final MoveTripRepository moveTripRepository;
}
