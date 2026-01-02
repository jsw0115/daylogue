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
        basePackages = "com.timepalette.daylogue.repository.settings",
        entityManagerFactoryRef = "settingsEntityManagerFactory",
        transactionManagerRef = "settingsTxManager"
)
public class SettingsDbJpaConfig {

    @Bean(name = "settingsDataSource")
    public DataSource settingsDataSource(@Qualifier("settingsDataSourceProperties") DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.settings-datasource")
    public DataSourceProperties settingsDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "settingsEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean settingsEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("settingsDataSource") DataSource ds) {

        Map<String, Object> jpaProps = new HashMap<>();

        // 3) 스키마 자동 변경은 개발에서만 사용 권장
        jpaProps.put("hibernate.hbm2ddl.auto", "none");
        jpaProps.put("hibernate.format_sql", true);

        return builder
                .dataSource(ds)
                .packages("com.timepalette.daylogue.model.entity.settings")
                .persistenceUnit("settings")
                .properties(jpaProps)
                .build();
    }

    @Bean
    public PlatformTransactionManager settingsTxManager(@Qualifier("settingsEntityManagerFactory") EntityManagerFactory emf) {

        return new JpaTransactionManager(emf);
    }
}
