package de.team5.super_cute.crocodile.external;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.TYPE})
@Inherited
@Retention(RetentionPolicy.RUNTIME)
public @interface C4CProperty {
  String name();

  String metadataType() default "";

  int maxLength() default Integer.MAX_VALUE;

  boolean associatedEntities() default false;
}
