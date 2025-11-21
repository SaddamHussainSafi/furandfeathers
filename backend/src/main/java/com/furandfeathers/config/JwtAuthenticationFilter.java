package com.furandfeathers.config;

import com.furandfeathers.entity.User;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip JWT check for public endpoints
        if (shouldBypassAuth(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtService.extractEmail(token);
                if (email != null) {
                    // Load user from database to get role
                    User user = userRepository.findByEmail(email).orElse(null);
                    if (user != null) {
                        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        );
                        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(email)
                            .password("")
                            .authorities(authorities)
                            .build();
                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                // Invalid token, continue without authentication
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldBypassAuth(String path) {
        return (path.startsWith("/api/auth/") && !path.equals("/api/auth/me")) ||
               path.startsWith("/api/pets") ||
               path.startsWith("/api/shelters") ||
               path.startsWith("/api/ai/") ||
               path.startsWith("/api/public") ||
               path.startsWith("/api/furly") ||
               path.startsWith("/uploads/");
    }
}
