package com.franksiret.project.web.rest;

import static com.franksiret.project.web.rest.AccountResourceIT.TEST_USER_LOGIN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.franksiret.project.IntegrationTest;
import com.franksiret.project.config.Constants;
import com.franksiret.project.domain.User;
import com.franksiret.project.repository.AuthorityRepository;
import com.franksiret.project.repository.UserRepository;
import com.franksiret.project.security.AuthoritiesConstants;
import com.franksiret.project.service.UserService;
import com.franksiret.project.service.dto.AdminUserDTO;
import com.franksiret.project.service.dto.UserDTO;
import com.franksiret.project.web.rest.vm.KeyAndPasswordVM;
import com.franksiret.project.web.rest.vm.ManagedUserVM;
import java.time.Instant;
import java.util.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AccountResource} REST controller.
 */
@AutoConfigureMockMvc
@WithMockUser(value = TEST_USER_LOGIN)
@IntegrationTest
class AccountResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restAccountMockMvc;

    @Test
    @WithUnauthenticatedMockUser
    void testNonAuthenticatedUser() throws Exception {
        restAccountMockMvc
            .perform(get("/api/authenticate").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string(""));
    }

    @Test
    void testAuthenticatedUser() throws Exception {
        restAccountMockMvc
            .perform(
                get("/api/authenticate")
                    .with(request -> {
                        request.setRemoteUser(TEST_USER_LOGIN);
                        return request;
                    })
                    .accept(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(TEST_USER_LOGIN));
    }

    @Test
    void testGetUnknownAccount() throws Exception {
        restAccountMockMvc
            .perform(get("/api/account").accept(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(status().isInternalServerError());
    }
}
