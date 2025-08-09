package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_members")
public class TeamMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private TeamRole role = TeamRole.TRADER;
    
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    @Column(name = "last_activity")
    private LocalDateTime lastActivity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private PaperTradingAccount account;
    
    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        lastActivity = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastActivity = LocalDateTime.now();
    }
    
    // Business methods
    public boolean canTrade() {
        return role == TeamRole.OWNER || role == TeamRole.TRADER;
    }
    
    public boolean canManage() {
        return role == TeamRole.OWNER;
    }
    
    public boolean canView() {
        return role == TeamRole.OWNER || role == TeamRole.TRADER || role == TeamRole.VIEWER;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TeamRole getRole() {
        return role;
    }
    
    public void setRole(TeamRole role) {
        this.role = role;
    }
    
    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
    
    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    public LocalDateTime getLastActivity() {
        return lastActivity;
    }
    
    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public PaperTradingAccount getAccount() {
        return account;
    }
    
    public void setAccount(PaperTradingAccount account) {
        this.account = account;
    }
    
    public enum TeamRole {
        OWNER, TRADER, VIEWER
    }
}