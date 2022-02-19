package com.franksiret.project.repository;

import com.franksiret.project.domain.Gateway;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Gateway entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GatewayRepository extends JpaRepository<Gateway, UUID>, JpaSpecificationExecutor<Gateway> {}
