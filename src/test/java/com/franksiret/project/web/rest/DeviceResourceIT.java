package com.franksiret.project.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.franksiret.project.IntegrationTest;
import com.franksiret.project.domain.Device;
import com.franksiret.project.domain.Gateway;
import com.franksiret.project.domain.enumeration.Status;
import com.franksiret.project.repository.DeviceRepository;
import com.franksiret.project.repository.GatewayRepository;
import com.franksiret.project.service.dto.DeviceDTO;
import com.franksiret.project.service.mapper.DeviceMapper;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link DeviceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DeviceResourceIT {

    private static final Integer DEFAULT_UID = 1;
    private static final Integer UPDATED_UID = 2;
    private static final Integer ANOTHER_UID = 3;
    private static final Integer SMALLER_UID = 1 - 1;

    private static final String DEFAULT_VENDOR = "AAAAAAAAAA";
    private static final String UPDATED_VENDOR = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_DATE = LocalDate.ofEpochDay(-1L);

    private static final Status DEFAULT_STATUS = Status.ONLINE;
    private static final Status UPDATED_STATUS = Status.OFFLINE;

    private static final String ENTITY_API_URL = "/api/devices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    // Data for create gateway
    private static final String DEFAULT_SERIAL_NUMBER = "AAAAAAAAAA";
    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String DEFAULT_IP_ADDRESS = "192.168.1.1";

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private GatewayRepository gatewayRepository;

    @Autowired
    private DeviceMapper deviceMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDeviceMockMvc;

    private Device device;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Device createEntity(EntityManager em) {
        Device device = new Device().uid(DEFAULT_UID).vendor(DEFAULT_VENDOR).date(DEFAULT_DATE).status(DEFAULT_STATUS);
        return device;
    }

    /**
     * Create an entity with UID provided for a test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Device createEntityWithUID(EntityManager em, Integer UID) {
        Device device = new Device().uid(UID).vendor(DEFAULT_VENDOR).date(DEFAULT_DATE).status(DEFAULT_STATUS);
        return device;
    }

    /**
     * Create a gateway entity for a test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gateway createGateway(EntityManager em) {
        Gateway gateway = new Gateway().serialNumber(DEFAULT_SERIAL_NUMBER).name(DEFAULT_NAME).ipAddress(DEFAULT_IP_ADDRESS);
        return gateway;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Device createUpdatedEntity(EntityManager em) {
        Device device = new Device().uid(UPDATED_UID).vendor(UPDATED_VENDOR).date(UPDATED_DATE).status(UPDATED_STATUS);
        return device;
    }

    @BeforeEach
    public void initTest() {
        device = createEntity(em);
    }

    @Test
    @Transactional
    void createDevice() throws Exception {
        int databaseSizeBeforeCreate = deviceRepository.findAll().size();
        // Create the Device
        DeviceDTO deviceDTO = deviceMapper.toDto(device);
        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isCreated());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeCreate + 1);
        Device testDevice = deviceList.get(deviceList.size() - 1);
        assertThat(testDevice.getUid()).isEqualTo(DEFAULT_UID);
        assertThat(testDevice.getVendor()).isEqualTo(DEFAULT_VENDOR);
        assertThat(testDevice.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testDevice.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createDeviceWithExistingId() throws Exception {
        // Create the Device with an existing ID
        deviceRepository.saveAndFlush(device);
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        int databaseSizeBeforeCreate = deviceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void createDeviceWithExistingUid() throws Exception {
        // Create the Device with an existing UID
        deviceRepository.saveAndFlush(device);

        Device newDevice = createEntityWithUID(em, DEFAULT_UID);
        DeviceDTO deviceDTO = deviceMapper.toDto(newDevice);

        int databaseSizeBeforeCreate = deviceRepository.findAll().size();

        // An entity with an existing UID cannot be created, so this API call must fail
        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void noMoreThan10DevicesAreAllowedForAGateway() throws Exception {
        // Create the Gateway
        Gateway gateway = createGateway(em);
        gatewayRepository.saveAndFlush(gateway);
        // Create the 10 Device with UIDs from 1 to 10
        for (int uid = 1; uid <= 10; uid++) {
            Device deviceUID = createEntityWithUID(em, uid);
            deviceUID.setGateway(gateway);
            deviceRepository.save(deviceUID);
        }
        deviceRepository.flush();

        // Create new device with UID 11
        Device newDevice = createEntityWithUID(em, 11);
        newDevice.setGateway(gateway);
        DeviceDTO deviceDTO = deviceMapper.toDto(newDevice);

        int databaseSizeBeforeCreate = deviceRepository.findAll().size();

        // A gateway cannot have more than 10 device related, so this API call must fail
        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkuidIsRequired() throws Exception {
        int databaseSizeBeforeTest = deviceRepository.findAll().size();
        // set the field null
        device.setUid(null);

        // Create the Device, which fails.
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isBadRequest());

        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVendorIsRequired() throws Exception {
        int databaseSizeBeforeTest = deviceRepository.findAll().size();
        // set the field null
        device.setVendor(null);

        // Create the Device, which fails.
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isBadRequest());

        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = deviceRepository.findAll().size();
        // set the field null
        device.setDate(null);

        // Create the Device, which fails.
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isBadRequest());

        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = deviceRepository.findAll().size();
        // set the field null
        device.setStatus(null);

        // Create the Device, which fails.
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        restDeviceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isBadRequest());

        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDevices() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList
        restDeviceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(device.getId().toString())))
            .andExpect(jsonPath("$.[*].uid").value(hasItem(DEFAULT_UID)))
            .andExpect(jsonPath("$.[*].vendor").value(hasItem(DEFAULT_VENDOR)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getDevice() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get the device
        restDeviceMockMvc
            .perform(get(ENTITY_API_URL_ID, device.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(device.getId().toString()))
            .andExpect(jsonPath("$.uid").value(DEFAULT_UID))
            .andExpect(jsonPath("$.vendor").value(DEFAULT_VENDOR))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getDevicesByIdFiltering() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        UUID id = device.getId();

        defaultDeviceShouldBeFound("id.equals=" + id);
        defaultDeviceShouldNotBeFound("id.notEquals=" + id);
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid equals to DEFAULT_UID
        defaultDeviceShouldBeFound("uid.equals=" + DEFAULT_UID);

        // Get all the deviceList where uid equals to UPDATED_UID
        defaultDeviceShouldNotBeFound("uid.equals=" + UPDATED_UID);
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsNotEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid not equals to DEFAULT_UID
        defaultDeviceShouldNotBeFound("uid.notEquals=" + DEFAULT_UID);

        // Get all the deviceList where uid not equals to UPDATED_UID
        defaultDeviceShouldBeFound("uid.notEquals=" + UPDATED_UID);
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsInShouldWork() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid in DEFAULT_UID or UPDATED_UID
        defaultDeviceShouldBeFound("uid.in=" + DEFAULT_UID + "," + UPDATED_UID);

        // Get all the deviceList where uid equals to UPDATED_UID
        defaultDeviceShouldNotBeFound("uid.in=" + UPDATED_UID);
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsNullOrNotNull() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid is not null
        defaultDeviceShouldBeFound("uid.specified=true");

        // Get all the deviceList where uid is null
        defaultDeviceShouldNotBeFound("uid.specified=false");
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid is greater than or equal to DEFAULT_UID
        defaultDeviceShouldBeFound("uid.greaterThanOrEqual=" + DEFAULT_UID);

        // Get all the deviceList where uid is greater than or equal to UPDATED_UID
        defaultDeviceShouldNotBeFound("uid.greaterThanOrEqual=" + UPDATED_UID);
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid is less than or equal to DEFAULT_UID
        defaultDeviceShouldBeFound("uid.lessThanOrEqual=" + DEFAULT_UID);

        // Get all the deviceList where uid is less than or equal to SMALLER_UID
        defaultDeviceShouldNotBeFound("uid.lessThanOrEqual=" + SMALLER_UID);
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsLessThanSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid is less than DEFAULT_UID
        defaultDeviceShouldNotBeFound("uid.lessThan=" + DEFAULT_UID);

        // Get all the deviceList where uid is less than UPDATED_UID
        defaultDeviceShouldBeFound("uid.lessThan=" + UPDATED_UID);
    }

    @Test
    @Transactional
    void getAllDevicesByuidIsGreaterThanSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where uid is greater than DEFAULT_UID
        defaultDeviceShouldNotBeFound("uid.greaterThan=" + DEFAULT_UID);

        // Get all the deviceList where uid is greater than SMALLER_UID
        defaultDeviceShouldBeFound("uid.greaterThan=" + SMALLER_UID);
    }

    @Test
    @Transactional
    void getAllDevicesByVendorIsEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where vendor equals to DEFAULT_VENDOR
        defaultDeviceShouldBeFound("vendor.equals=" + DEFAULT_VENDOR);

        // Get all the deviceList where vendor equals to UPDATED_VENDOR
        defaultDeviceShouldNotBeFound("vendor.equals=" + UPDATED_VENDOR);
    }

    @Test
    @Transactional
    void getAllDevicesByVendorIsNotEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where vendor not equals to DEFAULT_VENDOR
        defaultDeviceShouldNotBeFound("vendor.notEquals=" + DEFAULT_VENDOR);

        // Get all the deviceList where vendor not equals to UPDATED_VENDOR
        defaultDeviceShouldBeFound("vendor.notEquals=" + UPDATED_VENDOR);
    }

    @Test
    @Transactional
    void getAllDevicesByVendorIsInShouldWork() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where vendor in DEFAULT_VENDOR or UPDATED_VENDOR
        defaultDeviceShouldBeFound("vendor.in=" + DEFAULT_VENDOR + "," + UPDATED_VENDOR);

        // Get all the deviceList where vendor equals to UPDATED_VENDOR
        defaultDeviceShouldNotBeFound("vendor.in=" + UPDATED_VENDOR);
    }

    @Test
    @Transactional
    void getAllDevicesByVendorIsNullOrNotNull() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where vendor is not null
        defaultDeviceShouldBeFound("vendor.specified=true");

        // Get all the deviceList where vendor is null
        defaultDeviceShouldNotBeFound("vendor.specified=false");
    }

    @Test
    @Transactional
    void getAllDevicesByVendorContainsSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where vendor contains DEFAULT_VENDOR
        defaultDeviceShouldBeFound("vendor.contains=" + DEFAULT_VENDOR);

        // Get all the deviceList where vendor contains UPDATED_VENDOR
        defaultDeviceShouldNotBeFound("vendor.contains=" + UPDATED_VENDOR);
    }

    @Test
    @Transactional
    void getAllDevicesByVendorNotContainsSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where vendor does not contain DEFAULT_VENDOR
        defaultDeviceShouldNotBeFound("vendor.doesNotContain=" + DEFAULT_VENDOR);

        // Get all the deviceList where vendor does not contain UPDATED_VENDOR
        defaultDeviceShouldBeFound("vendor.doesNotContain=" + UPDATED_VENDOR);
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date equals to DEFAULT_DATE
        defaultDeviceShouldBeFound("date.equals=" + DEFAULT_DATE);

        // Get all the deviceList where date equals to UPDATED_DATE
        defaultDeviceShouldNotBeFound("date.equals=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsNotEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date not equals to DEFAULT_DATE
        defaultDeviceShouldNotBeFound("date.notEquals=" + DEFAULT_DATE);

        // Get all the deviceList where date not equals to UPDATED_DATE
        defaultDeviceShouldBeFound("date.notEquals=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsInShouldWork() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date in DEFAULT_DATE or UPDATED_DATE
        defaultDeviceShouldBeFound("date.in=" + DEFAULT_DATE + "," + UPDATED_DATE);

        // Get all the deviceList where date equals to UPDATED_DATE
        defaultDeviceShouldNotBeFound("date.in=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date is not null
        defaultDeviceShouldBeFound("date.specified=true");

        // Get all the deviceList where date is null
        defaultDeviceShouldNotBeFound("date.specified=false");
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date is greater than or equal to DEFAULT_DATE
        defaultDeviceShouldBeFound("date.greaterThanOrEqual=" + DEFAULT_DATE);

        // Get all the deviceList where date is greater than or equal to UPDATED_DATE
        defaultDeviceShouldNotBeFound("date.greaterThanOrEqual=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date is less than or equal to DEFAULT_DATE
        defaultDeviceShouldBeFound("date.lessThanOrEqual=" + DEFAULT_DATE);

        // Get all the deviceList where date is less than or equal to SMALLER_DATE
        defaultDeviceShouldNotBeFound("date.lessThanOrEqual=" + SMALLER_DATE);
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsLessThanSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date is less than DEFAULT_DATE
        defaultDeviceShouldNotBeFound("date.lessThan=" + DEFAULT_DATE);

        // Get all the deviceList where date is less than UPDATED_DATE
        defaultDeviceShouldBeFound("date.lessThan=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllDevicesByDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where date is greater than DEFAULT_DATE
        defaultDeviceShouldNotBeFound("date.greaterThan=" + DEFAULT_DATE);

        // Get all the deviceList where date is greater than SMALLER_DATE
        defaultDeviceShouldBeFound("date.greaterThan=" + SMALLER_DATE);
    }

    @Test
    @Transactional
    void getAllDevicesByStatusIsEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where status equals to DEFAULT_STATUS
        defaultDeviceShouldBeFound("status.equals=" + DEFAULT_STATUS);

        // Get all the deviceList where status equals to UPDATED_STATUS
        defaultDeviceShouldNotBeFound("status.equals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllDevicesByStatusIsNotEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where status not equals to DEFAULT_STATUS
        defaultDeviceShouldNotBeFound("status.notEquals=" + DEFAULT_STATUS);

        // Get all the deviceList where status not equals to UPDATED_STATUS
        defaultDeviceShouldBeFound("status.notEquals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllDevicesByStatusIsInShouldWork() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where status in DEFAULT_STATUS or UPDATED_STATUS
        defaultDeviceShouldBeFound("status.in=" + DEFAULT_STATUS + "," + UPDATED_STATUS);

        // Get all the deviceList where status equals to UPDATED_STATUS
        defaultDeviceShouldNotBeFound("status.in=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllDevicesByStatusIsNullOrNotNull() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        // Get all the deviceList where status is not null
        defaultDeviceShouldBeFound("status.specified=true");

        // Get all the deviceList where status is null
        defaultDeviceShouldNotBeFound("status.specified=false");
    }

    @Test
    @Transactional
    void getAllDevicesByGatewayIsEqualToSomething() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);
        Gateway gateway;
        if (TestUtil.findAll(em, Gateway.class).isEmpty()) {
            gateway = GatewayResourceIT.createEntity(em);
            em.persist(gateway);
            em.flush();
        } else {
            gateway = TestUtil.findAll(em, Gateway.class).get(0);
        }
        em.persist(gateway);
        em.flush();
        device.setGateway(gateway);
        deviceRepository.saveAndFlush(device);
        UUID gatewayId = gateway.getId();

        // Get all the deviceList where gateway equals to gatewayId
        defaultDeviceShouldBeFound("gatewayId.equals=" + gatewayId);

        // Get all the deviceList where gateway equals to UUID.randomUUID()
        defaultDeviceShouldNotBeFound("gatewayId.equals=" + UUID.randomUUID());
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultDeviceShouldBeFound(String filter) throws Exception {
        restDeviceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(device.getId().toString())))
            .andExpect(jsonPath("$.[*].uid").value(hasItem(DEFAULT_UID)))
            .andExpect(jsonPath("$.[*].vendor").value(hasItem(DEFAULT_VENDOR)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));

        // Check, that the count call also returns 1
        restDeviceMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultDeviceShouldNotBeFound(String filter) throws Exception {
        restDeviceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restDeviceMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingDevice() throws Exception {
        // Get the device
        restDeviceMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDevice() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();

        // Update the device
        Device updatedDevice = deviceRepository.findById(device.getId()).get();
        // Disconnect from session so that the updates on updatedDevice are not directly saved in db
        em.detach(updatedDevice);
        updatedDevice.uid(UPDATED_UID).vendor(UPDATED_VENDOR).date(UPDATED_DATE).status(UPDATED_STATUS);
        DeviceDTO deviceDTO = deviceMapper.toDto(updatedDevice);

        restDeviceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deviceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deviceDTO))
            )
            .andExpect(status().isOk());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
        Device testDevice = deviceList.get(deviceList.size() - 1);
        assertThat(testDevice.getUid()).isEqualTo(UPDATED_UID);
        assertThat(testDevice.getVendor()).isEqualTo(UPDATED_VENDOR);
        assertThat(testDevice.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testDevice.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingDevice() throws Exception {
        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();
        device.setId(UUID.randomUUID());

        // Create the Device
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeviceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deviceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDevice() throws Exception {
        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();
        device.setId(UUID.randomUUID());

        // Create the Device
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDevice() throws Exception {
        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();
        device.setId(UUID.randomUUID());

        // Create the Device
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deviceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDeviceWithPatch() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();

        // Update the device using partial update
        Device partialUpdatedDevice = new Device();
        partialUpdatedDevice.setId(device.getId());

        partialUpdatedDevice.status(UPDATED_STATUS);

        restDeviceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDevice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDevice))
            )
            .andExpect(status().isOk());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
        Device testDevice = deviceList.get(deviceList.size() - 1);
        assertThat(testDevice.getUid()).isEqualTo(DEFAULT_UID);
        assertThat(testDevice.getVendor()).isEqualTo(DEFAULT_VENDOR);
        assertThat(testDevice.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testDevice.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateDeviceWithPatch() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();

        // Update the device using partial update
        Device partialUpdatedDevice = new Device();
        partialUpdatedDevice.setId(device.getId());

        partialUpdatedDevice.uid(UPDATED_UID).vendor(UPDATED_VENDOR).date(UPDATED_DATE).status(UPDATED_STATUS);

        restDeviceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDevice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDevice))
            )
            .andExpect(status().isOk());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
        Device testDevice = deviceList.get(deviceList.size() - 1);
        assertThat(testDevice.getUid()).isEqualTo(UPDATED_UID);
        assertThat(testDevice.getVendor()).isEqualTo(UPDATED_VENDOR);
        assertThat(testDevice.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testDevice.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingDevice() throws Exception {
        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();
        device.setId(UUID.randomUUID());

        // Create the Device
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeviceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, deviceDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDevice() throws Exception {
        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();
        device.setId(UUID.randomUUID());

        // Create the Device
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDevice() throws Exception {
        int databaseSizeBeforeUpdate = deviceRepository.findAll().size();
        device.setId(UUID.randomUUID());

        // Create the Device
        DeviceDTO deviceDTO = deviceMapper.toDto(device);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(deviceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Device in the database
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDevice() throws Exception {
        // Initialize the database
        deviceRepository.saveAndFlush(device);

        int databaseSizeBeforeDelete = deviceRepository.findAll().size();

        // Delete the device
        restDeviceMockMvc
            .perform(delete(ENTITY_API_URL_ID, device.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Device> deviceList = deviceRepository.findAll();
        assertThat(deviceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
