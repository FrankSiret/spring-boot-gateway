package com.franksiret.project.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.franksiret.project.IntegrationTest;
import com.franksiret.project.domain.Device;
import com.franksiret.project.domain.Gateway;
import com.franksiret.project.repository.GatewayRepository;
import com.franksiret.project.service.criteria.GatewayCriteria;
import com.franksiret.project.service.dto.GatewayDTO;
import com.franksiret.project.service.mapper.GatewayMapper;
import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GatewayResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GatewayResourceIT {

    private static final String DEFAULT_SERIAL_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_SERIAL_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_IP_ADDRESS = "192.168.1.1";
    private static final String UPDATED_IP_ADDRESS = "192.168.1.2";

    private static final String ENTITY_API_URL = "/api/gateways";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private GatewayRepository gatewayRepository;

    @Autowired
    private GatewayMapper gatewayMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGatewayMockMvc;

    private Gateway gateway;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gateway createEntity(EntityManager em) {
        Gateway gateway = new Gateway().serialNumber(DEFAULT_SERIAL_NUMBER).name(DEFAULT_NAME).ipAddress(DEFAULT_IP_ADDRESS);
        return gateway;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gateway createUpdatedEntity(EntityManager em) {
        Gateway gateway = new Gateway().serialNumber(UPDATED_SERIAL_NUMBER).name(UPDATED_NAME).ipAddress(UPDATED_IP_ADDRESS);
        return gateway;
    }

    @BeforeEach
    public void initTest() {
        gateway = createEntity(em);
    }

    @Test
    @Transactional
    void createGateway() throws Exception {
        int databaseSizeBeforeCreate = gatewayRepository.findAll().size();
        // Create the Gateway
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);
        restGatewayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gatewayDTO)))
            .andExpect(status().isCreated());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeCreate + 1);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
        assertThat(testGateway.getSerialNumber()).isEqualTo(DEFAULT_SERIAL_NUMBER);
        assertThat(testGateway.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGateway.getIpAddress()).isEqualTo(DEFAULT_IP_ADDRESS);
    }

    @Test
    @Transactional
    void createGatewayWithExistingId() throws Exception {
        // Create the Gateway with an existing ID
        gatewayRepository.saveAndFlush(gateway);
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        int databaseSizeBeforeCreate = gatewayRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGatewayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gatewayDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSerialNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = gatewayRepository.findAll().size();
        // set the field null
        gateway.setSerialNumber(null);

        // Create the Gateway, which fails.
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        restGatewayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gatewayDTO)))
            .andExpect(status().isBadRequest());

        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = gatewayRepository.findAll().size();
        // set the field null
        gateway.setName(null);

        // Create the Gateway, which fails.
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        restGatewayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gatewayDTO)))
            .andExpect(status().isBadRequest());

        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIpAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = gatewayRepository.findAll().size();
        // set the field null
        gateway.setIpAddress(null);

        // Create the Gateway, which fails.
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        restGatewayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gatewayDTO)))
            .andExpect(status().isBadRequest());

        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGateways() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gateway.getId().toString())))
            .andExpect(jsonPath("$.[*].serialNumber").value(hasItem(DEFAULT_SERIAL_NUMBER)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].ipAddress").value(hasItem(DEFAULT_IP_ADDRESS)));
    }

    @Test
    @Transactional
    void getGateway() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get the gateway
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL_ID, gateway.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gateway.getId().toString()))
            .andExpect(jsonPath("$.serialNumber").value(DEFAULT_SERIAL_NUMBER))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.ipAddress").value(DEFAULT_IP_ADDRESS));
    }

    @Test
    @Transactional
    void getGatewaysByIdFiltering() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        UUID id = gateway.getId();

        defaultGatewayShouldBeFound("id.equals=" + id);
        defaultGatewayShouldNotBeFound("id.notEquals=" + id);
    }

    @Test
    @Transactional
    void getAllGatewaysBySerialNumberIsEqualToSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where serialNumber equals to DEFAULT_SERIAL_NUMBER
        defaultGatewayShouldBeFound("serialNumber.equals=" + DEFAULT_SERIAL_NUMBER);

        // Get all the gatewayList where serialNumber equals to UPDATED_SERIAL_NUMBER
        defaultGatewayShouldNotBeFound("serialNumber.equals=" + UPDATED_SERIAL_NUMBER);
    }

    @Test
    @Transactional
    void getAllGatewaysBySerialNumberIsNotEqualToSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where serialNumber not equals to DEFAULT_SERIAL_NUMBER
        defaultGatewayShouldNotBeFound("serialNumber.notEquals=" + DEFAULT_SERIAL_NUMBER);

        // Get all the gatewayList where serialNumber not equals to UPDATED_SERIAL_NUMBER
        defaultGatewayShouldBeFound("serialNumber.notEquals=" + UPDATED_SERIAL_NUMBER);
    }

    @Test
    @Transactional
    void getAllGatewaysBySerialNumberIsInShouldWork() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where serialNumber in DEFAULT_SERIAL_NUMBER or UPDATED_SERIAL_NUMBER
        defaultGatewayShouldBeFound("serialNumber.in=" + DEFAULT_SERIAL_NUMBER + "," + UPDATED_SERIAL_NUMBER);

        // Get all the gatewayList where serialNumber equals to UPDATED_SERIAL_NUMBER
        defaultGatewayShouldNotBeFound("serialNumber.in=" + UPDATED_SERIAL_NUMBER);
    }

    @Test
    @Transactional
    void getAllGatewaysBySerialNumberIsNullOrNotNull() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where serialNumber is not null
        defaultGatewayShouldBeFound("serialNumber.specified=true");

        // Get all the gatewayList where serialNumber is null
        defaultGatewayShouldNotBeFound("serialNumber.specified=false");
    }

    @Test
    @Transactional
    void getAllGatewaysBySerialNumberContainsSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where serialNumber contains DEFAULT_SERIAL_NUMBER
        defaultGatewayShouldBeFound("serialNumber.contains=" + DEFAULT_SERIAL_NUMBER);

        // Get all the gatewayList where serialNumber contains UPDATED_SERIAL_NUMBER
        defaultGatewayShouldNotBeFound("serialNumber.contains=" + UPDATED_SERIAL_NUMBER);
    }

    @Test
    @Transactional
    void getAllGatewaysBySerialNumberNotContainsSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where serialNumber does not contain DEFAULT_SERIAL_NUMBER
        defaultGatewayShouldNotBeFound("serialNumber.doesNotContain=" + DEFAULT_SERIAL_NUMBER);

        // Get all the gatewayList where serialNumber does not contain UPDATED_SERIAL_NUMBER
        defaultGatewayShouldBeFound("serialNumber.doesNotContain=" + UPDATED_SERIAL_NUMBER);
    }

    @Test
    @Transactional
    void getAllGatewaysByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where name equals to DEFAULT_NAME
        defaultGatewayShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the gatewayList where name equals to UPDATED_NAME
        defaultGatewayShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGatewaysByNameIsNotEqualToSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where name not equals to DEFAULT_NAME
        defaultGatewayShouldNotBeFound("name.notEquals=" + DEFAULT_NAME);

        // Get all the gatewayList where name not equals to UPDATED_NAME
        defaultGatewayShouldBeFound("name.notEquals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGatewaysByNameIsInShouldWork() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where name in DEFAULT_NAME or UPDATED_NAME
        defaultGatewayShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the gatewayList where name equals to UPDATED_NAME
        defaultGatewayShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGatewaysByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where name is not null
        defaultGatewayShouldBeFound("name.specified=true");

        // Get all the gatewayList where name is null
        defaultGatewayShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    void getAllGatewaysByNameContainsSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where name contains DEFAULT_NAME
        defaultGatewayShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the gatewayList where name contains UPDATED_NAME
        defaultGatewayShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGatewaysByNameNotContainsSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where name does not contain DEFAULT_NAME
        defaultGatewayShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the gatewayList where name does not contain UPDATED_NAME
        defaultGatewayShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGatewaysByIpAddressIsEqualToSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where ipAddress equals to DEFAULT_IP_ADDRESS
        defaultGatewayShouldBeFound("ipAddress.equals=" + DEFAULT_IP_ADDRESS);

        // Get all the gatewayList where ipAddress equals to UPDATED_IP_ADDRESS
        defaultGatewayShouldNotBeFound("ipAddress.equals=" + UPDATED_IP_ADDRESS);
    }

    @Test
    @Transactional
    void getAllGatewaysByIpAddressIsNotEqualToSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where ipAddress not equals to DEFAULT_IP_ADDRESS
        defaultGatewayShouldNotBeFound("ipAddress.notEquals=" + DEFAULT_IP_ADDRESS);

        // Get all the gatewayList where ipAddress not equals to UPDATED_IP_ADDRESS
        defaultGatewayShouldBeFound("ipAddress.notEquals=" + UPDATED_IP_ADDRESS);
    }

    @Test
    @Transactional
    void getAllGatewaysByIpAddressIsInShouldWork() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where ipAddress in DEFAULT_IP_ADDRESS or UPDATED_IP_ADDRESS
        defaultGatewayShouldBeFound("ipAddress.in=" + DEFAULT_IP_ADDRESS + "," + UPDATED_IP_ADDRESS);

        // Get all the gatewayList where ipAddress equals to UPDATED_IP_ADDRESS
        defaultGatewayShouldNotBeFound("ipAddress.in=" + UPDATED_IP_ADDRESS);
    }

    @Test
    @Transactional
    void getAllGatewaysByIpAddressIsNullOrNotNull() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where ipAddress is not null
        defaultGatewayShouldBeFound("ipAddress.specified=true");

        // Get all the gatewayList where ipAddress is null
        defaultGatewayShouldNotBeFound("ipAddress.specified=false");
    }

    @Test
    @Transactional
    void getAllGatewaysByIpAddressContainsSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where ipAddress contains DEFAULT_IP_ADDRESS
        defaultGatewayShouldBeFound("ipAddress.contains=" + DEFAULT_IP_ADDRESS);

        // Get all the gatewayList where ipAddress contains UPDATED_IP_ADDRESS
        defaultGatewayShouldNotBeFound("ipAddress.contains=" + UPDATED_IP_ADDRESS);
    }

    @Test
    @Transactional
    void getAllGatewaysByIpAddressNotContainsSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList where ipAddress does not contain DEFAULT_IP_ADDRESS
        defaultGatewayShouldNotBeFound("ipAddress.doesNotContain=" + DEFAULT_IP_ADDRESS);

        // Get all the gatewayList where ipAddress does not contain UPDATED_IP_ADDRESS
        defaultGatewayShouldBeFound("ipAddress.doesNotContain=" + UPDATED_IP_ADDRESS);
    }

    @Test
    @Transactional
    void getAllGatewaysByDeviceIsEqualToSomething() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);
        Device device;
        if (TestUtil.findAll(em, Device.class).isEmpty()) {
            device = DeviceResourceIT.createEntity(em);
            em.persist(device);
            em.flush();
        } else {
            device = TestUtil.findAll(em, Device.class).get(0);
        }
        em.persist(device);
        em.flush();
        gateway.addDevice(device);
        gatewayRepository.saveAndFlush(gateway);
        UUID deviceId = device.getId();

        // Get all the gatewayList where device equals to deviceId
        defaultGatewayShouldBeFound("deviceId.equals=" + deviceId);

        // Get all the gatewayList where device equals to UUID.randomUUID()
        defaultGatewayShouldNotBeFound("deviceId.equals=" + UUID.randomUUID());
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultGatewayShouldBeFound(String filter) throws Exception {
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gateway.getId().toString())))
            .andExpect(jsonPath("$.[*].serialNumber").value(hasItem(DEFAULT_SERIAL_NUMBER)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].ipAddress").value(hasItem(DEFAULT_IP_ADDRESS)));

        // Check, that the count call also returns 1
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultGatewayShouldNotBeFound(String filter) throws Exception {
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingGateway() throws Exception {
        // Get the gateway
        restGatewayMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGateway() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();

        // Update the gateway
        Gateway updatedGateway = gatewayRepository.findById(gateway.getId()).get();
        // Disconnect from session so that the updates on updatedGateway are not directly saved in db
        em.detach(updatedGateway);
        updatedGateway.serialNumber(UPDATED_SERIAL_NUMBER).name(UPDATED_NAME).ipAddress(UPDATED_IP_ADDRESS);
        GatewayDTO gatewayDTO = gatewayMapper.toDto(updatedGateway);

        restGatewayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gatewayDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gatewayDTO))
            )
            .andExpect(status().isOk());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
        assertThat(testGateway.getSerialNumber()).isEqualTo(UPDATED_SERIAL_NUMBER);
        assertThat(testGateway.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGateway.getIpAddress()).isEqualTo(UPDATED_IP_ADDRESS);
    }

    @Test
    @Transactional
    void putNonExistingGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(UUID.randomUUID());

        // Create the Gateway
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gatewayDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gatewayDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(UUID.randomUUID());

        // Create the Gateway
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gatewayDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(UUID.randomUUID());

        // Create the Gateway
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gatewayDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGatewayWithPatch() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();

        // Update the gateway using partial update
        Gateway partialUpdatedGateway = new Gateway();
        partialUpdatedGateway.setId(gateway.getId());

        partialUpdatedGateway.serialNumber(UPDATED_SERIAL_NUMBER);

        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGateway.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGateway))
            )
            .andExpect(status().isOk());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
        assertThat(testGateway.getSerialNumber()).isEqualTo(UPDATED_SERIAL_NUMBER);
        assertThat(testGateway.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGateway.getIpAddress()).isEqualTo(DEFAULT_IP_ADDRESS);
    }

    @Test
    @Transactional
    void fullUpdateGatewayWithPatch() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();

        // Update the gateway using partial update
        Gateway partialUpdatedGateway = new Gateway();
        partialUpdatedGateway.setId(gateway.getId());

        partialUpdatedGateway.serialNumber(UPDATED_SERIAL_NUMBER).name(UPDATED_NAME).ipAddress(UPDATED_IP_ADDRESS);

        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGateway.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGateway))
            )
            .andExpect(status().isOk());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
        assertThat(testGateway.getSerialNumber()).isEqualTo(UPDATED_SERIAL_NUMBER);
        assertThat(testGateway.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGateway.getIpAddress()).isEqualTo(UPDATED_IP_ADDRESS);
    }

    @Test
    @Transactional
    void patchNonExistingGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(UUID.randomUUID());

        // Create the Gateway
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gatewayDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gatewayDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(UUID.randomUUID());

        // Create the Gateway
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gatewayDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(UUID.randomUUID());

        // Create the Gateway
        GatewayDTO gatewayDTO = gatewayMapper.toDto(gateway);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(gatewayDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGateway() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeDelete = gatewayRepository.findAll().size();

        // Delete the gateway
        restGatewayMockMvc
            .perform(delete(ENTITY_API_URL_ID, gateway.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
