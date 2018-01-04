package de.team5.super_cute.crocodile.config;

import static de.team5.super_cute.crocodile.config.AppConfiguration.LIVEDATA_FREQUENCY;

import com.google.common.cache.CacheBuilder;
import java.util.concurrent.TimeUnit;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Configuration;


@EnableCaching
@Configuration
public class CacheConfig extends CachingConfigurerSupport {

  @Override
  public CacheManager cacheManager() {
    ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager() {

      @Override
      protected Cache createConcurrentMapCache(final String name) {
        return new ConcurrentMapCache(name,
            CacheBuilder.newBuilder().expireAfterWrite(LIVEDATA_FREQUENCY, TimeUnit.MILLISECONDS).maximumSize(100).build().asMap(), false);
      }
    };

    return cacheManager;
  }
}
