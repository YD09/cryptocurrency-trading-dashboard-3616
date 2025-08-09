package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "alert_triggers")
public class AlertTrigger {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private TriggerStatus status = TriggerStatus.PENDING;
    
    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;
    
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    
    @Column(columnDefinition = "TEXT")
    private String triggerData;
    
    @Column(columnDefinition = "TEXT")
    private String deliveryResponse;
    
    @Enumerated(EnumType.STRING)
    private DeliveryMethod deliveryMethod;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id")
    private Alert alert;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @PrePersist
    protected void onCreate() {
        triggeredAt = LocalDateTime.now();
    }
    
    // Business methods
    public void markDelivered() {
        this.status = TriggerStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }
    
    public void markFailed(String errorMessage) {
        this.status = TriggerStatus.FAILED;
        this.deliveryResponse = errorMessage;
    }
    
    public boolean isDelivered() {
        return status == TriggerStatus.DELIVERED;
    }
    
    public boolean isFailed() {
        return status == TriggerStatus.FAILED;
    }
    
    public boolean isPending() {
        return status == TriggerStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TriggerStatus getStatus() {
        return status;
    }
    
    public void setStatus(TriggerStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getTriggeredAt() {
        return triggeredAt;
    }
    
    public void setTriggeredAt(LocalDateTime triggeredAt) {
        this.triggeredAt = triggeredAt;
    }
    
    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }
    
    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
    
    public String getTriggerData() {
        return triggerData;
    }
    
    public void setTriggerData(String triggerData) {
        this.triggerData = triggerData;
    }
    
    public String getDeliveryResponse() {
        return deliveryResponse;
    }
    
    public void setDeliveryResponse(String deliveryResponse) {
        this.deliveryResponse = deliveryResponse;
    }
    
    public DeliveryMethod getDeliveryMethod() {
        return deliveryMethod;
    }
    
    public void setDeliveryMethod(DeliveryMethod deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }
    
    public Alert getAlert() {
        return alert;
    }
    
    public void setAlert(Alert alert) {
        this.alert = alert;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public enum TriggerStatus {
        PENDING, DELIVERED, FAILED
    }
    
    public enum DeliveryMethod {
        EMAIL, WEB_NOTIFICATION, WEBHOOK
    }
}