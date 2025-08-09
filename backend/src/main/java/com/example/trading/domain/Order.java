package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String symbol;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private OrderType type;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private OrderSide side;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal volume;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal price;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal stopLoss;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal takeProfit;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(name = "filled_volume", precision = 19, scale = 8)
    private BigDecimal filledVolume = BigDecimal.ZERO;
    
    @Column(name = "filled_price", precision = 19, scale = 8)
    private BigDecimal filledPrice;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "filled_at")
    private LocalDateTime filledAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private PaperTradingAccount account;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Position position;
    
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
    public boolean isFullyFilled() {
        return filledVolume.compareTo(volume) >= 0;
    }
    
    public boolean isPartiallyFilled() {
        return filledVolume.compareTo(BigDecimal.ZERO) > 0 && !isFullyFilled();
    }
    
    public BigDecimal getRemainingVolume() {
        return volume.subtract(filledVolume);
    }
    
    public void fill(BigDecimal fillVolume, BigDecimal fillPrice) {
        this.filledVolume = this.filledVolume.add(fillVolume);
        this.filledPrice = fillPrice;
        this.filledAt = LocalDateTime.now();
        
        if (isFullyFilled()) {
            this.status = OrderStatus.FILLED;
        } else if (isPartiallyFilled()) {
            this.status = OrderStatus.PARTIALLY_FILLED;
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    
    public OrderType getType() {
        return type;
    }
    
    public void setType(OrderType type) {
        this.type = type;
    }
    
    public OrderSide getSide() {
        return side;
    }
    
    public void setSide(OrderSide side) {
        this.side = side;
    }
    
    public BigDecimal getVolume() {
        return volume;
    }
    
    public void setVolume(BigDecimal volume) {
        this.volume = volume;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getStopLoss() {
        return stopLoss;
    }
    
    public void setStopLoss(BigDecimal stopLoss) {
        this.stopLoss = stopLoss;
    }
    
    public BigDecimal getTakeProfit() {
        return takeProfit;
    }
    
    public void setTakeProfit(BigDecimal takeProfit) {
        this.takeProfit = takeProfit;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    
    public BigDecimal getFilledVolume() {
        return filledVolume;
    }
    
    public void setFilledVolume(BigDecimal filledVolume) {
        this.filledVolume = filledVolume;
    }
    
    public BigDecimal getFilledPrice() {
        return filledPrice;
    }
    
    public void setFilledPrice(BigDecimal filledPrice) {
        this.filledPrice = filledPrice;
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
    
    public LocalDateTime getFilledAt() {
        return filledAt;
    }
    
    public void setFilledAt(LocalDateTime filledAt) {
        this.filledAt = filledAt;
    }
    
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public PaperTradingAccount getAccount() {
        return account;
    }
    
    public void setAccount(PaperTradingAccount account) {
        this.account = account;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Position getPosition() {
        return position;
    }
    
    public void setPosition(Position position) {
        this.position = position;
    }
    
    public enum OrderType {
        MARKET, LIMIT, STOP, STOP_LIMIT
    }
    
    public enum OrderSide {
        BUY, SELL
    }
    
    public enum OrderStatus {
        PENDING, PARTIALLY_FILLED, FILLED, CANCELLED, REJECTED, EXPIRED
    }
}