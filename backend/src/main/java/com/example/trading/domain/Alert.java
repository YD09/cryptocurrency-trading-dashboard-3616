package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "alerts")
public class Alert {
    
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
    private String condition;
    
    @Enumerated(EnumType.STRING)
    private AlertType type = AlertType.STRATEGY;
    
    @Enumerated(EnumType.STRING)
    private AlertStatus status = AlertStatus.ACTIVE;
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "alert_delivery_methods", joinColumns = @JoinColumn(name = "alert_id"))
    @Column(name = "delivery_method")
    private Set<DeliveryMethod> deliveryMethods;
    
    @Column(name = "email_address")
    private String emailAddress;
    
    @Column(name = "webhook_url")
    private String webhookUrl;
    
    @Column(name = "last_triggered")
    private LocalDateTime lastTriggered;
    
    @Column(name = "trigger_count")
    private Integer triggerCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strategy_id")
    private Strategy strategy;
    
    @OneToMany(mappedBy = "alert", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AlertTrigger> triggers;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Business methods
    public void trigger() {
        this.lastTriggered = LocalDateTime.now();
        this.triggerCount++;
    }
    
    public boolean isEmailEnabled() {
        return deliveryMethods != null && deliveryMethods.contains(DeliveryMethod.EMAIL);
    }
    
    public boolean isWebNotificationEnabled() {
        return deliveryMethods != null && deliveryMethods.contains(DeliveryMethod.WEB_NOTIFICATION);
    }
    
    public boolean isWebhookEnabled() {
        return deliveryMethods != null && deliveryMethods.contains(DeliveryMethod.WEBHOOK);
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
    
    public String getCondition() {
        return condition;
    }
    
    public void setCondition(String condition) {
        this.condition = condition;
    }
    
    public AlertType getType() {
        return type;
    }
    
    public void setType(AlertType type) {
        this.type = type;
    }
    
    public AlertStatus getStatus() {
        return status;
    }
    
    public void setStatus(AlertStatus status) {
        this.status = status;
    }
    
    public Set<DeliveryMethod> getDeliveryMethods() {
        return deliveryMethods;
    }
    
    public void setDeliveryMethods(Set<DeliveryMethod> deliveryMethods) {
        this.deliveryMethods = deliveryMethods;
    }
    
    public String getEmailAddress() {
        return emailAddress;
    }
    
    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }
    
    public String getWebhookUrl() {
        return webhookUrl;
    }
    
    public void setWebhookUrl(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    
    public LocalDateTime getLastTriggered() {
        return lastTriggered;
    }
    
    public void setLastTriggered(LocalDateTime lastTriggered) {
        this.lastTriggered = lastTriggered;
    }
    
    public Integer getTriggerCount() {
        return triggerCount;
    }
    
    public void setTriggerCount(Integer triggerCount) {
        this.triggerCount = triggerCount;
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
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Strategy getStrategy() {
        return strategy;
    }
    
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }
    
    public Set<AlertTrigger> getTriggers() {
        return triggers;
    }
    
    public void setTriggers(Set<AlertTrigger> triggers) {
        this.triggers = triggers;
    }
    
    public enum AlertType {
        STRATEGY, PRICE, TECHNICAL_INDICATOR, CUSTOM
    }
    
    public enum AlertStatus {
        ACTIVE, PAUSED, ARCHIVED
    }
    
    public enum DeliveryMethod {
        EMAIL, WEB_NOTIFICATION, WEBHOOK
    }
}