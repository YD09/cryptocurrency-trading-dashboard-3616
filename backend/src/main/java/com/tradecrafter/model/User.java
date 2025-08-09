package com.tradecrafter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.TRADER;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PineScript> pineScripts = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TradingAccount> tradingAccounts = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Alert> alerts = new HashSet<>();
    
    @ManyToMany(mappedBy = "members")
    private Set<Team> teams = new HashSet<>();
    
    // Constructors
    public User() {}
    
    public User(String email, String firstName, String lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Set<PineScript> getPineScripts() { return pineScripts; }
    public void setPineScripts(Set<PineScript> pineScripts) { this.pineScripts = pineScripts; }
    
    public Set<TradingAccount> getTradingAccounts() { return tradingAccounts; }
    public void setTradingAccounts(Set<TradingAccount> tradingAccounts) { this.tradingAccounts = tradingAccounts; }
    
    public Set<Alert> getAlerts() { return alerts; }
    public void setAlerts(Set<Alert> alerts) { this.alerts = alerts; }
    
    public Set<Team> getTeams() { return teams; }
    public void setTeams(Set<Team> teams) { this.teams = teams; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

enum UserRole {
    ADMIN, OWNER, TRADER, VIEWER
}