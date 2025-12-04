package com.furandfeathers.config;

import com.furandfeathers.config.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "https://ff.saddamhussain.com.np",
            "http://ff.saddamhussain.com.np"
        ));
        config.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/signup",
                                "/api/auth/login",
                                "/api/auth/google",
                                "/api/pets/name/**",
                                "/api/shelters",
                                "/api/shelters/**",
                                "/uploads/**",
                                "/api/ai/**",
                                "/api/ai/pet-detect",
                                "/api/chat",
                                "/api/furly/**")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/pets", "/api/pets/")
                        .permitAll()
                        .requestMatchers(new RegexRequestMatcher("^/api/pets/\\d+$", "GET")).permitAll()
                        .requestMatchers(new RegexRequestMatcher("^/api/pets/\\d+/likes$", "GET")).permitAll()
                        .requestMatchers(new RegexRequestMatcher("^/api/pets/\\d+/comments$", "GET")).permitAll()
                        .requestMatchers(
                                "/api/auth/me",
                                "/api/pets/saved",
                                "/api/pets/*/save",
                                "/api/pets/my-pets",
                                "/api/pets/pending",
                                "/api/pets/*/approve",
                                "/api/pets/*/reject")
                        .authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(
                        (req, res, e) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED)));

        return http.build();
    }
}
