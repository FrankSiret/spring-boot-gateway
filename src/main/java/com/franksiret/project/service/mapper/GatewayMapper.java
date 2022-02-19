package com.franksiret.project.service.mapper;

import com.franksiret.project.domain.Gateway;
import com.franksiret.project.service.dto.GatewayDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Gateway} and its DTO {@link GatewayDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface GatewayMapper extends EntityMapper<GatewayDTO, Gateway> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GatewayDTO toDtoId(Gateway gateway);
}
