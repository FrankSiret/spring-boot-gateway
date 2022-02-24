package com.franksiret.project.service.mapper;

import com.franksiret.project.domain.Gateway;
import com.franksiret.project.service.dto.GatewayDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Gateway} and its DTO {@link GatewayDTO}.
 */
@Mapper(componentModel = "spring", uses = { DeviceMapper.class })
public interface GatewayMapper extends EntityMapper<GatewayDTO, Gateway> {
    @Mapping(target = "devices", source = "devices", qualifiedByName = "idSet")
    GatewayDTO toDto(Gateway gateway);

    @Named("id")
    @Mapping(target = "devices", source = "devices", ignore = true)
    GatewayDTO toDtoId(Gateway gateway);
}
