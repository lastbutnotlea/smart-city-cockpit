package de.team5.super_cute.crocodile.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "announcement")
public class Announcement extends IdentifiableObject implements TickerItemable {

    @Column
    private String text;

    @Column
    private LocalDateTime validFrom;

    @Column
    private LocalDateTime validTo;

    @ElementCollection(fetch = FetchType.EAGER)
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
