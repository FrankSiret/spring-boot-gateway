package com.franksiret.project.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DeviceMapperTest {

    private DeviceMapper deviceMapper;

    @BeforeEach
    public void setUp() {
        deviceMapper = new DeviceMapperImpl();
    }
}
