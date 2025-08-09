package com.tradecrafter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @ManyToMany
    @JoinTable(
        name = "team_members",
        joinColumns = @JoinColumn(name = "team_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TradingAccount> tradingAccounts = new HashSet<>();
    
    // Constructors
    public Team() {}
    
    public Team(String name, User owner) {
        this.name = name;
        this.owner = owner;
        this.members.add(owner);
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    
    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }
    
    public Set<TradingAccount> getTradingAccounts() { return tradingAccounts; }
    public void setTradingAccounts(Set<TradingAccount> tradingAccounts) { this.tradingAccounts = tradingAccounts; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public void addMember(User user) {
        this.members.add(user);
        user.getTeams().add(this);
    }
    
    public void removeMember(User user) {
        this.members.remove(user);
        user.getTeams().remove(this);
    }
}