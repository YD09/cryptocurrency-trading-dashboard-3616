package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "positions")
public class Position {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String symbol;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private PositionSide side;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal volume;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal openPrice;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal currentPrice;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal stopLoss;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal takeProfit;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal unrealizedPnL = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal realizedPnL = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal margin = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    private PositionStatus status = PositionStatus.OPEN;
    
    @Column(name = "opened_at")
    private LocalDateTime openedAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "closed_at")
    private LocalDateTime closedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private PaperTradingAccount account;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    @PrePersist
    protected void onCreate() {
        openedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Business methods
    public void updateCurrentPrice(BigDecimal newPrice) {
        this.currentPrice = newPrice;
        calculateUnrealizedPnL();
    }
    
    public void calculateUnrealizedPnL() {
        if (currentPrice != null && openPrice != null && volume != null) {
            if (side == PositionSide.LONG) {
                unrealizedPnL = currentPrice.subtract(openPrice).multiply(volume);
            } else {
                unrealizedPnL = openPrice.subtract(currentPrice).multiply(volume);
            }
        }
    }
    
    public void close(BigDecimal closePrice) {
        this.currentPrice = closePrice;
        calculateUnrealizedPnL();
        this.realizedPnL = this.unrealizedPnL;
        this.status = PositionStatus.CLOSED;
        this.closedAt = LocalDateTime.now();
    }
    
    public boolean isLong() {
        return side == PositionSide.LONG;
    }
    
    public boolean isShort() {
        return side == PositionSide.SHORT;
    }
    
    public boolean isProfitable() {
        return unrealizedPnL.compareTo(BigDecimal.ZERO) > 0;
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
    
    public PositionSide getSide() {
        return side;
    }
    
    public void setSide(PositionSide side) {
        this.side = side;
    }
    
    public BigDecimal getVolume() {
        return volume;
    }
    
    public void setVolume(BigDecimal volume) {
        this.volume = volume;
    }
    
    public BigDecimal getOpenPrice() {
        return openPrice;
    }
    
    public void setOpenPrice(BigDecimal openPrice) {
        this.openPrice = openPrice;
    }
    
    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }
    
    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
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
    
    public BigDecimal getUnrealizedPnL() {
        return unrealizedPnL;
    }
    
    public void setUnrealizedPnL(BigDecimal unrealizedPnL) {
        this.unrealizedPnL = unrealizedPnL;
    }
    
    public BigDecimal getRealizedPnL() {
        return realizedPnL;
    }
    
    public void setRealizedPnL(BigDecimal realizedPnL) {
        this.realizedPnL = realizedPnL;
    }
    
    public BigDecimal getMargin() {
        return margin;
    }
    
    public void setMargin(BigDecimal margin) {
        this.margin = margin;
    }
    
    public PositionStatus getStatus() {
        return status;
    }
    
    public void setStatus(PositionStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getOpenedAt() {
        return openedAt;
    }
    
    public void setOpenedAt(LocalDateTime openedAt) {
        this.openedAt = openedAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getClosedAt() {
        return closedAt;
    }
    
    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
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
    
    public Order getOrder() {
        return order;
    }
    
    public void setOrder(Order order) {
        this.order = order;
    }
    
    public enum PositionSide {
        LONG, SHORT
    }
    
    public enum PositionStatus {
        OPEN, CLOSED, PARTIALLY_CLOSED
    }
}