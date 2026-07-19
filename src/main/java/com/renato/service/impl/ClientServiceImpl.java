package com.renato.service.impl;

import com.renato.mapper.ClientMapper;
import com.renato.model.Client;
import com.renato.payload.dto.ClientDTO;
import com.renato.repository.ClientRepository;
import com.renato.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        Client client = ClientMapper.toEntity(clientDTO);
        return ClientMapper.toDTO(clientRepository.save(client));
    }

    @Override
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(ClientMapper::toDTO)
                .collect(Collectors.toList());
    }
}
