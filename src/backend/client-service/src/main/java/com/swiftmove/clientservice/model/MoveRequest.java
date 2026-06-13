package com.swiftmove.clientservice.model;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "move_requests")
public class MoveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "move_date")
    private Instant moveDate;
    @Column(name = "max_budget")
    private Long maxBudget;
    @Column(name = "client_id")
    private Long clientId;
    @Column(name = "from_address_id")
    private Long fromAddressId;
    @Column(name = "to_address_id")
    private Long toAddressId;
    @Column(name = "distance")
    private Double distance;
    @Column(name = "from_latitude")
    private Double fromLatitude;
    @Column(name = "from_longitude")
    private Double fromLongitude;
    @Column(name = "to_latitude")
    private Double toLatitude;
    @Column(name = "to_longitude")
    private Double toLongitude;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "move_status_enum")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private MoveStatus status;
    @Column(name = "has_furniture")
    private Boolean hasFurniture;
    @Column(name = "note")
    private String note;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
    // @Transient
    // private List<MoveOfferDto> moveOffers;
    // @Transient
    // private List<LuggageEntry> luggageEntries;

}
