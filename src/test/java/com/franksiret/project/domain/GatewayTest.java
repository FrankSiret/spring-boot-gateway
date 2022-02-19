package com.franksiret.project.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.franksiret.project.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class GatewayTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Gateway.class);
        Gateway gateway1 = new Gateway();
        gateway1.setId(UUID.randomUUID());
        Gateway gateway2 = new Gateway();
        gateway2.setId(gateway1.getId());
        assertThat(gateway1).isEqualTo(gateway2);
        gateway2.setId(UUID.randomUUID());
        assertThat(gateway1).isNotEqualTo(gateway2);
        gateway1.setId(null);
        assertThat(gateway1).isNotEqualTo(gateway2);
    }
}
