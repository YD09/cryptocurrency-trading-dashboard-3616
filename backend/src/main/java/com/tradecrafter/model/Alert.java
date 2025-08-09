package com.tradecrafter.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String symbol;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertCondition condition;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal targetPrice;
    
    @Column(length = 2000)
    private String customCondition;
    
    @Column(nullable = false)
    private Boolean emailEnabled = true;
    
    @Column(nullable = false)
    private Boolean webEnabled = true;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isTriggered = false;
    
    @Column
    private LocalDateTime lastTriggered;
    
    @Column(nullable = false)
    private Integer triggerCount = 0;
    
    @Column
    private Integer maxTriggers;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime expiresAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pine_script_id")
    private PineScript pineScript;
    
    // Constructors
    public Alert() {}
    
    public Alert(String name, String symbol, AlertType alertType, 
                 AlertCondition condition, User user) {
        this.name = name;
        this.symbol = symbol;
        this.alertType = alertType;
        this.condition = condition;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    
    public AlertType getAlertType() { return alertType; }
    public void setAlertType(AlertType alertType) { this.alertType = alertType; }
    
    public AlertCondition getCondition() { return condition; }
    public void setCondition(AlertCondition condition) { this.condition = condition; }
    
    public BigDecimal getTargetPrice() { return targetPrice; }
    public void setTargetPrice(BigDecimal targetPrice) { this.targetPrice = targetPrice; }
    
    public String getCustomCondition() { return customCondition; }
    public void setCustomCondition(String customCondition) { this.customCondition = customCondition; }
    
    public Boolean getEmailEnabled() { return emailEnabled; }
    public void setEmailEnabled(Boolean emailEnabled) { this.emailEnabled = emailEnabled; }
    
    public Boolean getWebEnabled() { return webEnabled; }
    public void setWebEnabled(Boolean webEnabled) { this.webEnabled = webEnabled; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Boolean getIsTriggered() { return isTriggered; }
    public void setIsTriggered(Boolean isTriggered) { this.isTriggered = isTriggered; }
    
    public LocalDateTime getLastTriggered() { return lastTriggered; }
    public void setLastTriggered(LocalDateTime lastTriggered) { this.lastTriggered = lastTriggered; }
    
    public Integer getTriggerCount() { return triggerCount; }
    public void setTriggerCount(Integer triggerCount) { this.triggerCount = triggerCount; }
    
    public Integer getMaxTriggers() { return maxTriggers; }
    public void setMaxTriggers(Integer maxTriggers) { this.maxTriggers = maxTriggers; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public PineScript getPineScript() { return pineScript; }
    public void setPineScript(PineScript pineScript) { this.pineScript = pineScript; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

enum AlertType {
    PRICE, INDICATOR, STRATEGY
}

enum AlertCondition {
    GREATER_THAN, LESS_THAN, EQUALS, CROSSES_ABOVE, CROSSES_BELOW, CUSTOM
}