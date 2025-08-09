package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "strategies")
public class Strategy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String pineScript;
    
    @Enumerated(EnumType.STRING)
    private StrategyStatus status = StrategyStatus.DRAFT;
    
    @Enumerated(EnumType.STRING)
    private StrategyType type = StrategyType.CUSTOM;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_backtest_at")
    private LocalDateTime lastBacktestAt;
    
    @Column(name = "is_public")
    private boolean isPublic = false;
    
    @Column(name = "version")
    private String version = "1.0";
    
    @OneToMany(mappedBy = "strategy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<BacktestResult> backtestResults;
    
    @OneToMany(mappedBy = "strategy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Alert> alerts;
    
    @OneToMany(mappedBy = "strategy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PaperTradingExecution> executions;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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
    
    public String getPineScript() {
        return pineScript;
    }
    
    public void setPineScript(String pineScript) {
        this.pineScript = pineScript;
    }
    
    public StrategyStatus getStatus() {
        return status;
    }
    
    public void setStatus(StrategyStatus status) {
        this.status = status;
    }
    
    public StrategyType getType() {
        return type;
    }
    
    public void setType(StrategyType type) {
        this.type = type;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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
    
    public LocalDateTime getLastBacktestAt() {
        return lastBacktestAt;
    }
    
    public void setLastBacktestAt(LocalDateTime lastBacktestAt) {
        this.lastBacktestAt = lastBacktestAt;
    }
    
    public boolean isPublic() {
        return isPublic;
    }
    
    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public Set<BacktestResult> getBacktestResults() {
        return backtestResults;
    }
    
    public void setBacktestResults(Set<BacktestResult> backtestResults) {
        this.backtestResults = backtestResults;
    }
    
    public Set<Alert> getAlerts() {
        return alerts;
    }
    
    public void setAlerts(Set<Alert> alerts) {
        this.alerts = alerts;
    }
    
    public Set<PaperTradingExecution> getExecutions() {
        return executions;
    }
    
    public void setExecutions(Set<PaperTradingExecution> executions) {
        this.executions = executions;
    }
    
    public enum StrategyStatus {
        DRAFT, ACTIVE, PAUSED, ARCHIVED
    }
    
    public enum StrategyType {
        CUSTOM, TEMPLATE, IMPORTED
    }
}