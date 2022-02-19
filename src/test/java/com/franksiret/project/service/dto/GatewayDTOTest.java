package com.franksiret.project.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.franksiret.project.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class GatewayDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GatewayDTO.class);
        GatewayDTO gatewayDTO1 = new GatewayDTO();
        gatewayDTO1.setId(UUID.randomUUID());
        GatewayDTO gatewayDTO2 = new GatewayDTO();
        assertThat(gatewayDTO1).isNotEqualTo(gatewayDTO2);
        gatewayDTO2.setId(gatewayDTO1.getId());
        assertThat(gatewayDTO1).isEqualTo(gatewayDTO2);
        gatewayDTO2.setId(UUID.randomUUID());
        assertThat(gatewayDTO1).isNotEqualTo(gatewayDTO2);
        gatewayDTO1.setId(null);
        assertThat(gatewayDTO1).isNotEqualTo(gatewayDTO2);
    }
}
