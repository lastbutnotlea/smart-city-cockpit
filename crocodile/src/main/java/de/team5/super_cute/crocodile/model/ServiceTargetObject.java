package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "identifiableType")
@JsonSubTypes({
    @Type(value = Stop.class, name = "stop"),
    @Type(value = Vehicle.class, name = "vehicle"),
})
public interface ServiceTargetObject {

}
