package com.renato.service;

import com.renato.payload.dto.ClientDTO;

import java.util.List;

public interface ClientService {

    ClientDTO createClient(ClientDTO clientDTO);

    List<ClientDTO> getAllClients();
}
