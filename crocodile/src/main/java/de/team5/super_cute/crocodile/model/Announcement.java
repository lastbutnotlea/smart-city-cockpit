package de.team5.super_cute.crocodile.model;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcement")
public class Announcement extends IdentifiableObject implements TickerItemable {

    private String text;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
}
