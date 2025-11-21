package com.furandfeathers.controller;

import com.furandfeathers.entity.User;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getShelters(@RequestParam(required = false) Boolean verified) {  
        return userRepository.findByRole(UserRole.SHELTER);
    }
}
