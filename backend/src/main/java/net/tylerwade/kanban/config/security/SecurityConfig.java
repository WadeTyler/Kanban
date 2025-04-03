package net.tylerwade.kanban.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .authorizeHttpRequests(authz -> authz
                                .requestMatchers("/", "/error").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                )
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("http://localhost:3000", true).permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("http://localhost:3000").permitAll()
                );

        return http.build();
    }

}
