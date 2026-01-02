package com.timepalette.daylogue.config.db;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.timepalette.daylogue.repository.routine",
        entityManagerFactoryRef = "routineEntityManagerFactory",
        transactionManagerRef = "routineTxManager"
)
public class RoutineDbJpaConfig {

    @Bean(name = "routineDataSource")
    public DataSource routineDataSource(@Qualifier("routineDataSourceProperties") DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.routine-datasource")
    public DataSourceProperties routineDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "routineEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean routineEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("routineDataSource") DataSource ds) {

        Map<String, Object> jpaProps = new HashMap<>();

        // 3) 스키마 자동 변경은 개발에서만 사용 권장
        jpaProps.put("hibernate.hbm2ddl.auto", "none");
        jpaProps.put("hibernate.format_sql", true);

        return builder
                .dataSource(ds)
                .packages("com.timepalette.daylogue.model.entity.routine")
                .persistenceUnit("routine")
                .properties(jpaProps)
                .build();
    }

    @Bean
    public PlatformTransactionManager routineTxManager(@Qualifier("routineEntityManagerFactory") EntityManagerFactory emf) {

        return new JpaTransactionManager(emf);
    }
}
