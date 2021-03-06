package com.franksiret.project.service.mapper;

import com.franksiret.project.domain.Device;
import com.franksiret.project.service.dto.DeviceDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Device} and its DTO {@link DeviceDTO}.
 */
@Mapper(componentModel = "spring", uses = { GatewayMapper.class })
public interface DeviceMapper extends EntityMapper<DeviceDTO, Device> {
    @Mapping(target = "gateway", source = "gateway")
    DeviceDTO toDto(Device s);
}
