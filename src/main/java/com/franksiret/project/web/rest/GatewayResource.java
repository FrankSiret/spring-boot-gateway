package com.franksiret.project.web.rest;

import com.franksiret.project.domain.Device;
import com.franksiret.project.domain.Gateway;
import com.franksiret.project.repository.DeviceRepository;
import com.franksiret.project.repository.GatewayRepository;
import com.franksiret.project.service.GatewayQueryService;
import com.franksiret.project.service.GatewayService;
import com.franksiret.project.service.criteria.GatewayCriteria;
import com.franksiret.project.service.dto.DeviceDTO;
import com.franksiret.project.service.dto.GatewayDTO;
import com.franksiret.project.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.franksiret.project.domain.Gateway}.
 */
@RestController
@RequestMapping("/api")
public class GatewayResource {

    private final Logger log = LoggerFactory.getLogger(GatewayResource.class);

    private static final String ENTITY_NAME = "gateway";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GatewayService gatewayService;

    private final GatewayRepository gatewayRepository;

    private final GatewayQueryService gatewayQueryService;

    private final DeviceRepository deviceRepository;

    public GatewayResource(
        GatewayService gatewayService,
        GatewayRepository gatewayRepository,
        GatewayQueryService gatewayQueryService,
        DeviceRepository deviceRepository
    ) {
        this.gatewayService = gatewayService;
        this.gatewayRepository = gatewayRepository;
        this.gatewayQueryService = gatewayQueryService;
        this.deviceRepository = deviceRepository;
    }

    /**
     * {@code POST  /gateways} : Create a new gateway.
     *
     * @param gatewayDTO the gatewayDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gatewayDTO, or with status {@code 400 (Bad Request)} if the gateway has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/gateways")
    public ResponseEntity<GatewayDTO> createGateway(@Valid @RequestBody GatewayDTO gatewayDTO) throws URISyntaxException {
        log.debug("REST request to save Gateway : {}", gatewayDTO);
        if (gatewayDTO.getId() != null) {
            throw new BadRequestAlertException("A new gateway cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (gatewayRepository.existsBySerialNumber(gatewayDTO.getSerialNumber())) {
            throw new BadRequestAlertException("Serial number already exist", ENTITY_NAME, "serialnumbercloned");
        }
        GatewayDTO result = gatewayService.save(gatewayDTO);
        return ResponseEntity
            .created(new URI("/api/gateways/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gateways/:id} : Updates an existing gateway.
     *
     * @param id the id of the gatewayDTO to save.
     * @param gatewayDTO the gatewayDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gatewayDTO,
     * or with status {@code 400 (Bad Request)} if the gatewayDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gatewayDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/gateways/{id}")
    public ResponseEntity<GatewayDTO> updateGateway(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody GatewayDTO gatewayDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Gateway : {}, {}", id, gatewayDTO);
        if (gatewayDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gatewayDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gatewayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        List<Gateway> serialNumberList = gatewayRepository.findBySerialNumber(gatewayDTO.getSerialNumber());
        boolean matchSerialNumber = serialNumberList.stream().anyMatch(gateway -> gateway.getId() != id);
        if (matchSerialNumber) {
            throw new BadRequestAlertException("Serial number already exist", ENTITY_NAME, "serialnumbercloned");
        }

        GatewayDTO result = gatewayService.save(gatewayDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gatewayDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /gateways/:id} : Partial updates given fields of an existing gateway, field will ignore if it is null
     *
     * @param id the id of the gatewayDTO to save.
     * @param gatewayDTO the gatewayDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gatewayDTO,
     * or with status {@code 400 (Bad Request)} if the gatewayDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gatewayDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gatewayDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/gateways/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GatewayDTO> partialUpdateGateway(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody GatewayDTO gatewayDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Gateway partially : {}, {}", id, gatewayDTO);
        if (gatewayDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gatewayDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gatewayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        List<Gateway> serialNumberList = gatewayRepository.findBySerialNumber(gatewayDTO.getSerialNumber());
        boolean matchSerialNumber = serialNumberList.stream().anyMatch(gateway -> gateway.getId() != id);
        if (matchSerialNumber) {
            throw new BadRequestAlertException("Serial number already exist", ENTITY_NAME, "serialnumbercloned");
        }

        Optional<GatewayDTO> result = gatewayService.partialUpdate(gatewayDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gatewayDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /gateways} : get all the gateways.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gateways in body.
     */
    @GetMapping("/gateways")
    public ResponseEntity<List<GatewayDTO>> getAllGateways(
        GatewayCriteria criteria,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get Gateways by criteria: {}", criteria);
        Page<GatewayDTO> page = gatewayQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /gateways/count} : count all the gateways.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/gateways/count")
    public ResponseEntity<Long> countGateways(GatewayCriteria criteria) {
        log.debug("REST request to count Gateways by criteria: {}", criteria);
        return ResponseEntity.ok().body(gatewayQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /gateways/:id} : get the "id" gateway.
     *
     * @param id the id of the gatewayDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gatewayDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gateways/{id}")
    public ResponseEntity<GatewayDTO> getGateway(@PathVariable UUID id) {
        log.debug("REST request to get Gateway : {}", id);
        Optional<GatewayDTO> gatewayDTO = gatewayService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gatewayDTO);
    }

    /**
     * {@code DELETE  /gateways/:id} : delete the "id" gateway.
     *
     * @param id the id of the gatewayDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/gateways/{id}")
    public ResponseEntity<Void> deleteGateway(@PathVariable UUID id) {
        log.debug("REST request to delete Gateway : {}", id);
        gatewayService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /gateways/:id/devices} : get all devices from a gateway.
     *
     * @param id the id of the gatewayDTO.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of devices in body.
     */
    @GetMapping("/gateways/{id}/devices")
    public ResponseEntity<List<Device>> getAllDevices(@PathVariable UUID id) {
        log.debug("REST request to get all Devices from the gateway: {}", id);
        List<Device> devices = deviceRepository.findByGateway_Id(id);
        return ResponseEntity.ok().body(devices);
    }
}
