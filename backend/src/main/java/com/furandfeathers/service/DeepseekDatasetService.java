package com.furandfeathers.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.furandfeathers.model.DeepseekDataset;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Service
public class DeepseekDatasetService {

    private DeepseekDataset dataset;

    @PostConstruct
    public void loadDataset() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ClassPathResource resource = new ClassPathResource("deepseek_json_20251029_b120bf.json");
            InputStream inputStream = resource.getInputStream();
            dataset = mapper.readValue(inputStream, DeepseekDataset.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load Deepseek dataset", e);
        }
    }

    public DeepseekDataset getDataset() {
        return dataset;
    }
}