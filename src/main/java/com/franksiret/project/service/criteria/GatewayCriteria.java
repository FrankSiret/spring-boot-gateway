package com.franksiret.project.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;
import tech.jhipster.service.filter.UUIDFilter;

/**
 * Criteria class for the {@link com.franksiret.project.domain.Gateway} entity. This class is used
 * in {@link com.franksiret.project.web.rest.GatewayResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /gateways?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class GatewayCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private UUIDFilter id;

    private StringFilter serialNumber;

    private StringFilter name;

    private StringFilter ipAddress;

    private UUIDFilter deviceId;

    private Boolean distinct;

    public GatewayCriteria() {}

    public GatewayCriteria(GatewayCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.serialNumber = other.serialNumber == null ? null : other.serialNumber.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.ipAddress = other.ipAddress == null ? null : other.ipAddress.copy();
        this.deviceId = other.deviceId == null ? null : other.deviceId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public GatewayCriteria copy() {
        return new GatewayCriteria(this);
    }

    public UUIDFilter getId() {
        return id;
    }

    public UUIDFilter id() {
        if (id == null) {
            id = new UUIDFilter();
        }
        return id;
    }

    public void setId(UUIDFilter id) {
        this.id = id;
    }

    public StringFilter getSerialNumber() {
        return serialNumber;
    }

    public StringFilter serialNumber() {
        if (serialNumber == null) {
            serialNumber = new StringFilter();
        }
        return serialNumber;
    }

    public void setSerialNumber(StringFilter serialNumber) {
        this.serialNumber = serialNumber;
    }

    public StringFilter getName() {
        return name;
    }

    public StringFilter name() {
        if (name == null) {
            name = new StringFilter();
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public StringFilter getIpAddress() {
        return ipAddress;
    }

    public StringFilter ipAddress() {
        if (ipAddress == null) {
            ipAddress = new StringFilter();
        }
        return ipAddress;
    }

    public void setIpAddress(StringFilter ipAddress) {
        this.ipAddress = ipAddress;
    }

    public UUIDFilter getDeviceId() {
        return deviceId;
    }

    public UUIDFilter deviceId() {
        if (deviceId == null) {
            deviceId = new UUIDFilter();
        }
        return deviceId;
    }

    public void setDeviceId(UUIDFilter deviceId) {
        this.deviceId = deviceId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final GatewayCriteria that = (GatewayCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(serialNumber, that.serialNumber) &&
            Objects.equals(name, that.name) &&
            Objects.equals(ipAddress, that.ipAddress) &&
            Objects.equals(deviceId, that.deviceId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, serialNumber, name, ipAddress, deviceId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GatewayCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (serialNumber != null ? "serialNumber=" + serialNumber + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (ipAddress != null ? "ipAddress=" + ipAddress + ", " : "") +
            (deviceId != null ? "deviceId=" + deviceId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
