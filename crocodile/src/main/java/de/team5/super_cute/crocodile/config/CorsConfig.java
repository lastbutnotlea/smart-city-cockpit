package de.team5.super_cute.crocodile.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
  @Bean
  public FilterRegistrationBean corsFilter() {
    return getBean(getCorsFilter(getConfig()));
  }

  private FilterRegistrationBean getBean(CorsFilter filter) {
    FilterRegistrationBean bean = new FilterRegistrationBean(filter);
    bean.setOrder(0);
    return bean;
  }

  private CorsFilter getCorsFilter(CorsConfiguration config) {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }

  private CorsConfiguration getConfig() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("*");
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    return config;
  }
}
