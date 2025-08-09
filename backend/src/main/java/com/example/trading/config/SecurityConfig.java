package com.example.trading.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .cors(Customizer.withDefaults())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/", "/login", "/css/**", "/js/**", "/actuator/health", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
        .requestMatchers("/api/**").authenticated()
        .anyRequest().authenticated()
      )
      .oauth2Login(Customizer.withDefaults())
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    String allowed = System.getenv("CORS_ALLOWED_ORIGINS");
    List<String> origins = allowed != null && !allowed.isBlank()
      ? Arrays.asList(allowed.split(","))
      : List.of("http://localhost:5173", "http://127.0.0.1:5173");

    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(origins);
    config.addAllowedHeader("*");
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  /**
   * Helper to extract the Supabase user id from the JWT ("sub"). Example usage:
   * String userId = CurrentUser.getUserId(jwt);
   */
  public static final class CurrentUser {
    public static String getUserId(@AuthenticationPrincipal Jwt jwt) {
      return jwt.getSubject();
    }
  }
}