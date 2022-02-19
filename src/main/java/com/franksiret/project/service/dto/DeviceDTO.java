package com.franksiret.project.service.dto;

import com.franksiret.project.domain.enumeration.Status;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.franksiret.project.domain.Device} entity.
 */
public class DeviceDTO implements Serializable {

    private UUID id;

    @NotNull
    private Integer uID;

    @NotNull
    private String vendor;

    @NotNull
    private Instant date;

    @NotNull
    private Status status;

    private GatewayDTO gateway;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getuID() {
        return uID;
    }

    public void setuID(Integer uID) {
        this.uID = uID;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public GatewayDTO getGateway() {
        return gateway;
    }

    public void setGateway(GatewayDTO gateway) {
        this.gateway = gateway;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DeviceDTO)) {
            return false;
        }

        DeviceDTO deviceDTO = (DeviceDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, deviceDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DeviceDTO{" +
            "id='" + getId() + "'" +
            ", uID=" + getuID() +
            ", vendor='" + getVendor() + "'" +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", gateway=" + getGateway() +
            "}";
    }
}
