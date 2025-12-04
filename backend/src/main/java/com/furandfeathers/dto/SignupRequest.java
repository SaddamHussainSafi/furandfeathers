package com.furandfeathers.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
    @NotBlank(message = "Name is required.")
    @Size(min = 4, max = 80, message = "Name must be between 4 and 80 characters.")
    @Pattern(
        regexp = "^(?=.{4,80}$)[A-Za-z]+(?:[A-Za-z' -]*[A-Za-z])?(?:\\s+[A-Za-z]+(?:[A-Za-z' -]*[A-Za-z])?)+$",
        message = "Provide first and last name using letters, spaces, hyphens, or apostrophes."
    )
    String name,

    @NotBlank(message = "Email is required.")
    @Email(message = "Enter a valid email address.")
    String email,

    @NotBlank(message = "Password is required.")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Password must include letters and numbers.")
    String password,

    @NotBlank(message = "Role is required.")
    @Pattern(regexp = "(?i)adopter|shelter", message = "Role must be ADOPTER or SHELTER.")
    String role
) {}
