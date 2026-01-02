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
        basePackages = "com.timepalette.daylogue.repository.share",
        entityManagerFactoryRef = "shareEntityManagerFactory",
        transactionManagerRef = "shareTxManager"
)
public class ShareDbJpaConfig {

    @Bean(name = "shareDataSource")
    public DataSource shareDataSource(@Qualifier("shareDataSourceProperties") DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.share-datasource")
    public DataSourceProperties shareDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "shareEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean shareEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("shareDataSource") DataSource ds) {

        Map<String, Object> jpaProps = new HashMap<>();

        // 3) 스키마 자동 변경은 개발에서만 사용 권장
        jpaProps.put("hibernate.hbm2ddl.auto", "none");
        jpaProps.put("hibernate.format_sql", true);

        return builder
                .dataSource(ds)
                .packages("com.timepalette.daylogue.model.entity.share")
                .persistenceUnit("share")
                .properties(jpaProps)
                .build();
    }

    @Bean
    public PlatformTransactionManager shareTxManager(@Qualifier("shareEntityManagerFactory") EntityManagerFactory emf) {

        return new JpaTransactionManager(emf);
    }
}
