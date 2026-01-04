package com.timepalette.daylogue.config.db;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.timepalette.daylogue.repository.common",
        entityManagerFactoryRef = "commonEntityManagerFactory",
        transactionManagerRef = "commonTxManager"
)
public class CommonDbJpaConfig {

    @Bean(name = "commonDataSourceProperties")
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSourceProperties commonDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
//    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource commonDataSource(@Qualifier("authDataSourceProperties") DataSourceProperties props) {
        // 바인딩이 깨지면 여기서 바로 원인 확정
        if (props.getUrl() == null || props.getUrl().isBlank()) {
            throw new IllegalStateException("spring.datasource.url is empty (profile override / yml indentation check)");
        }

        return props.initializeDataSourceBuilder().build();
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean commonEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("commonDataSource") DataSource ds) {

        Map<String, Object> jpaProps = new HashMap<>();
        // SQLServerDialect 같은 거 절대 넣지 말 것 (MySQL/MariaDB면 자동 선택 권장)
        jpaProps.put("hibernate.hbm2ddl.auto", "none");
        jpaProps.put("hibernate.format_sql", true);

        return builder
                .dataSource(ds)
                .packages("com.timepalette.daylogue.model.entity.common")
                .persistenceUnit("common")
                .properties(jpaProps)
                .build();
    }

    @Bean
    @Primary
    public PlatformTransactionManager commonTxManager(@Qualifier("commonEntityManagerFactory") EntityManagerFactory emf) {

//        JpaTransactionManager transactionManager = new JpaTransactionManager();
//        transactionManager.setEntityManagerFactory(commonEntityManager().getObject());
//        return transactionManager;
        return new JpaTransactionManager(emf);
    }
}
