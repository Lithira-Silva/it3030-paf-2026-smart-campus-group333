package com.smartcampus.operationshub.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.smartcampus.operationshub.facilities.entity.Facility;
import com.smartcampus.operationshub.facilities.entity.FacilityStatus;
import com.smartcampus.operationshub.facilities.entity.FacilityType;
import com.smartcampus.operationshub.facilities.repository.FacilityRepository;

@Configuration
@Profile("local")
public class LocalTempDataSeeder {

    private static final Logger log = LoggerFactory.getLogger(LocalTempDataSeeder.class);
    private static final String TEMP_FACILITY_NAME = "TEMP_SYNC_DB_CHECK";

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner seedTemporaryFacility(FacilityRepository facilityRepository) {
        return args -> {
            if (facilityRepository.existsByName(TEMP_FACILITY_NAME)) {
                log.info("Temporary DB check record already exists: {}", TEMP_FACILITY_NAME);
                return;
            }

            Facility facility = new Facility();
            facility.setName(TEMP_FACILITY_NAME);
            facility.setType(FacilityType.LAB);
            facility.setCapacity(10);
            facility.setLocation("Sync Test Zone");
            facility.setStatus(FacilityStatus.ACTIVE);

            Facility saved = facilityRepository.save(facility);
            log.info("Inserted temporary DB check record id={} name={}", saved.getId(), saved.getName());
        };
    }
}
