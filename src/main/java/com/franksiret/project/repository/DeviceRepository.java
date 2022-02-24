package com.franksiret.project.repository;

import com.franksiret.project.domain.Device;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Device entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID>, JpaSpecificationExecutor<Device> {
    List<Device> findByGateway_Id(UUID id);

    long countByGateway_Id(UUID id);

    List<Device> findByUID(Integer uID);

    boolean existsByUID(Integer uID);
}
