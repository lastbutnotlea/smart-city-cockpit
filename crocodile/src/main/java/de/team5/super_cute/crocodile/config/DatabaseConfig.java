package de.team5.super_cute.crocodile.config;

import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.net.URI;
import java.net.URISyntaxException;
import javax.sql.DataSource;
import javax.transaction.Transactional;
import org.apache.commons.dbcp.BasicDataSource;
import org.hibernate.FlushMode;
import org.hibernate.SessionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBuilder;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class DatabaseConfig {

  @Bean
  @Transactional
  public HibernateTemplate getHibernateTemplate() {
    HibernateTemplate ht =  new HibernateTemplate(getSessionFactory());
    ht.getSessionFactory().getCurrentSession().setFlushMode(FlushMode.AUTO);
    return ht;
  }

  @Bean
  public SessionFactory getSessionFactory() {
    return new LocalSessionFactoryBuilder(getDataSource())
        .addAnnotatedClasses(IdentifiableObject.class, Line.class, Stop.class, Trip.class, Vehicle.class)
        .setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect")
        .setProperty("hibernate.hbm2ddl.auto", "create")
        .setProperty("packagesToScan", "de.team5.super_cute.crocodile.model")
        .buildSessionFactory();
  }

  @Bean
  public DataSource getDataSource() {
    URI dbUri = null;
    BasicDataSource dataSource = new BasicDataSource();
    dataSource.setDriverClassName("org.postgresql.Driver");
    try {
      dbUri = new URI(System.getenv("DATABASE_URL"));
    } catch (URISyntaxException e) {
      e.printStackTrace();
    } catch (NullPointerException e) {
      dataSource.setUrl("jdbc:postgresql://localhost/postgres");
      dataSource.setUsername("team5");
      dataSource.setPassword("augsburg123");
      return dataSource;
    }

    String username = dbUri.getUserInfo().split(":")[0];
    String password = dbUri.getUserInfo().split(":")[1];
    String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
    dataSource.setUrl(dbUrl);
    dataSource.setUsername(username);
    dataSource.setPassword(password);
    return dataSource;
  }

  @Bean
  public HibernateTransactionManager getHibernateTransactionManager(){
    return new HibernateTransactionManager(getSessionFactory());
  }

}
