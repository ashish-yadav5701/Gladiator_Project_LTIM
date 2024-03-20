package com.wecp.eventmanagementsystem.config;

import com.wecp.eventmanagementsystem.jwt.JwtRequestFilter;
import com.wecp.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity

public class SecurityConfig {

    // injecting JwtRequestFilter
    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    // creates a bean for UserDetailsService
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService();
    }

    // method to filter request on the basis of roles
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/user/login").permitAll()
                .antMatchers("/api/user/register").permitAll()
                .antMatchers("/api/users").permitAll()
                .antMatchers("/api/user/{userId}").permitAll()
                .antMatchers(HttpMethod.POST, "/api/planner/event").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/events").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/events_sorted").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.POST, "/api/planner/resource").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/resources").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.POST, "/api/planner/allocate-resources").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/staff/event-details/{eventId}").hasAuthority("STAFF")
                .antMatchers(HttpMethod.GET, "/api/staff/all-event-details").hasAuthority("STAFF")
                .antMatchers(HttpMethod.PUT, "/api/staff/update-setup/{eventId}").hasAuthority("STAFF")
                .antMatchers(HttpMethod.GET, "/api/client/booking-details/{eventId}").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/client/allocation/{eventId}").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/client/events").hasAuthority("CLIENT")
                .antMatchers("/api/**").authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // this method creates a bean for BCryptPasswordEncoder to encode passwords
    // securely
    @Bean
    public PasswordEncoder passwordEncoders() {
        return new BCryptPasswordEncoder();
    }

    // manage authentication requests
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // creates a bean for AuthenticationProvider for authenticating users
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoders());
        return authenticationProvider;
    }
}