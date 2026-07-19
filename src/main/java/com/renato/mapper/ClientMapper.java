package com.renato.mapper;

import com.renato.model.Client;
import com.renato.payload.dto.ClientDTO;

public class ClientMapper {

    public static ClientDTO toDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setName(client.getName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setDocument(client.getDocument());
        dto.setAddress(client.getAddress());
        dto.setCreatedAt(client.getCreatedAt());
        return dto;
    }

    public static Client toEntity(ClientDTO dto) {
        Client client = new Client();
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setDocument(dto.getDocument());
        client.setAddress(dto.getAddress());
        return client;
    }
}
