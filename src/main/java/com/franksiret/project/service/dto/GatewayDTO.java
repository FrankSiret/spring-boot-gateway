package com.franksiret.project.service.dto;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.franksiret.project.domain.Gateway} entity.
 */
public class GatewayDTO implements Serializable {

    private UUID id;

    @NotNull
    private String serialNumber;

    @NotNull
    private String name;

    @NotNull
    @Pattern(regexp = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
    private String ipAddress;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GatewayDTO)) {
            return false;
        }

        GatewayDTO gatewayDTO = (GatewayDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gatewayDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GatewayDTO{" +
            "id='" + getId() + "'" +
            ", serialNumber='" + getSerialNumber() + "'" +
            ", name='" + getName() + "'" +
            ", ipAddress='" + getIpAddress() + "'" +
            "}";
    }
}
