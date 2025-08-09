package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "paper_trading_accounts")
public class PaperTradingAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal balance;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal equity;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal margin;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal freeMargin;
    
    @NotNull
    @Positive
    @Column(precision = 5, scale = 2)
    private BigDecimal marginLevel = BigDecimal.valueOf(100.0);
    
    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.ACTIVE;
    
    @Enumerated(EnumType.STRING)
    private AccountType type = AccountType.PERSONAL;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_activity")
    private LocalDateTime lastActivity;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TeamMember> teamMembers;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Order> orders;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Position> positions;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Trade> trades;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PaperTradingExecution> executions;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastActivity = LocalDateTime.now();
        
        // Initialize account values
        if (balance == null) {
            balance = BigDecimal.valueOf(10000.0); // Default balance
        }
        if (equity == null) {
            equity = balance;
        }
        if (margin == null) {
            margin = BigDecimal.ZERO;
        }
        if (freeMargin == null) {
            freeMargin = balance;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        lastActivity = LocalDateTime.now();
    }
    
    // Business methods
    public void updateEquity(BigDecimal newEquity) {
        this.equity = newEquity;
        this.freeMargin = equity.subtract(margin);
        if (margin.compareTo(BigDecimal.ZERO) > 0) {
            this.marginLevel = equity.divide(margin, 2, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        } else {
            this.marginLevel = BigDecimal.valueOf(100.0);
        }
    }
    
    public void updateMargin(BigDecimal newMargin) {
        this.margin = newMargin;
        this.freeMargin = equity.subtract(margin);
        if (margin.compareTo(BigDecimal.ZERO) > 0) {
            this.marginLevel = equity.divide(margin, 2, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        } else {
            this.marginLevel = BigDecimal.valueOf(100.0);
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getBalance() {
        return balance;
    }
    
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
    
    public BigDecimal getEquity() {
        return equity;
    }
    
    public void setEquity(BigDecimal equity) {
        this.equity = equity;
    }
    
    public BigDecimal getMargin() {
        return margin;
    }
    
    public void setMargin(BigDecimal margin) {
        this.margin = margin;
    }
    
    public BigDecimal getFreeMargin() {
        return freeMargin;
    }
    
    public void setFreeMargin(BigDecimal freeMargin) {
        this.freeMargin = freeMargin;
    }
    
    public BigDecimal getMarginLevel() {
        return marginLevel;
    }
    
    public void setMarginLevel(BigDecimal marginLevel) {
        this.marginLevel = marginLevel;
    }
    
    public AccountStatus getStatus() {
        return status;
    }
    
    public void setStatus(AccountStatus status) {
        this.status = status;
    }
    
    public AccountType getType() {
        return type;
    }
    
    public void setType(AccountType type) {
        this.type = type;
    }
    
    public User getOwner() {
        return owner;
    }
    
    public void setOwner(User owner) {
        this.owner = owner;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getLastActivity() {
        return lastActivity;
    }
    
    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }
    
    public Set<TeamMember> getTeamMembers() {
        return teamMembers;
    }
    
    public void setTeamMembers(Set<TeamMember> teamMembers) {
        this.teamMembers = teamMembers;
    }
    
    public Set<Order> getOrders() {
        return orders;
    }
    
    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }
    
    public Set<Position> getPositions() {
        return positions;
    }
    
    public void setPositions(Set<Position> positions) {
        this.positions = positions;
    }
    
    public Set<Trade> getTrades() {
        return trades;
    }
    
    public void setTrades(Set<Trade> trades) {
        this.trades = trades;
    }
    
    public Set<PaperTradingExecution> getExecutions() {
        return executions;
    }
    
    public void setExecutions(Set<PaperTradingExecution> executions) {
        this.executions = executions;
    }
    
    public enum AccountStatus {
        ACTIVE, SUSPENDED, CLOSED
    }
    
    public enum AccountType {
        PERSONAL, TEAM
    }
}