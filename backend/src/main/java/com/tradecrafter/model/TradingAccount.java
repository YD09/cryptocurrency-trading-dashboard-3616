package com.tradecrafter.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "trading_accounts")
public class TradingAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal balance;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal initialBalance;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal equity;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal margin = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal freeMargin;
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal commissionRate = new BigDecimal("0.001");
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal slippageRate = new BigDecimal("0.0001");
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType = AccountType.PAPER;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status = AccountStatus.ACTIVE;
    
    @Column(name = "is_shared", nullable = false)
    private Boolean isShared = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
    
    @OneToMany(mappedBy = "tradingAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Trade> trades = new HashSet<>();
    
    @OneToMany(mappedBy = "tradingAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Order> orders = new HashSet<>();
    
    // Constructors
    public TradingAccount() {}
    
    public TradingAccount(String name, BigDecimal initialBalance, User user) {
        this.name = name;
        this.initialBalance = initialBalance;
        this.balance = initialBalance;
        this.equity = initialBalance;
        this.freeMargin = initialBalance;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    
    public BigDecimal getInitialBalance() { return initialBalance; }
    public void setInitialBalance(BigDecimal initialBalance) { this.initialBalance = initialBalance; }
    
    public BigDecimal getEquity() { return equity; }
    public void setEquity(BigDecimal equity) { this.equity = equity; }
    
    public BigDecimal getMargin() { return margin; }
    public void setMargin(BigDecimal margin) { this.margin = margin; }
    
    public BigDecimal getFreeMargin() { return freeMargin; }
    public void setFreeMargin(BigDecimal freeMargin) { this.freeMargin = freeMargin; }
    
    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }
    
    public BigDecimal getSlippageRate() { return slippageRate; }
    public void setSlippageRate(BigDecimal slippageRate) { this.slippageRate = slippageRate; }
    
    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }
    
    public AccountStatus getStatus() { return status; }
    public void setStatus(AccountStatus status) { this.status = status; }
    
    public Boolean getIsShared() { return isShared; }
    public void setIsShared(Boolean isShared) { this.isShared = isShared; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    
    public Set<Trade> getTrades() { return trades; }
    public void setTrades(Set<Trade> trades) { this.trades = trades; }
    
    public Set<Order> getOrders() { return orders; }
    public void setOrders(Set<Order> orders) { this.orders = orders; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

enum AccountType {
    PAPER, LIVE
}

enum AccountStatus {
    ACTIVE, SUSPENDED, CLOSED
}