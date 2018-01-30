package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.team5.super_cute.crocodile.util.DateDeserializer;
import de.team5.super_cute.crocodile.util.DateSerializer;
import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "announcement")
public class Announcement extends IdentifiableObject {

    @Column
    private String text;

    @Column
    @Convert(converter = LocalDateTimeAttributeConverter.class)
    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDeserializer.class)
    private LocalDateTime validFrom;

    @Column
    @Convert(converter = LocalDateTimeAttributeConverter.class)
    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDeserializer.class)
    private LocalDateTime validTo;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Stop> stops;

    public Announcement() {
        super();
    }

    public Announcement(String text, LocalDateTime validFrom, LocalDateTime validTo, List<Stop> stops) {
        this.text = text;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.stops = stops;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDateTime getValidTo() {
        return validTo;
    }

    public void setValidTo(LocalDateTime validTo) {
        this.validTo = validTo;
    }

    public List<Stop> getStops() {
        return stops;
    }

    public void setStops(List<Stop> stops) {
        this.stops = stops;
    }
}
