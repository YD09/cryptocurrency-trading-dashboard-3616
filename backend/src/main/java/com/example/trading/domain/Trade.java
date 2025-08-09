package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
public class Trade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String symbol;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private TradeSide side;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal volume;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal openPrice;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal closePrice;
    
    @NotNull
    @Column(precision = 19, scale = 8)
    private BigDecimal pnl;
    
    @NotNull
    @Column(precision = 5, scale = 2)
    private BigDecimal pnlPercent;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal commission = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal slippage = BigDecimal.ZERO;
    
    @Column(name = "open_time")
    private LocalDateTime openTime;
    
    @Column(name = "close_time")
    private LocalDateTime closeTime;
    
    @Column(name = "duration_minutes")
    private Long durationMinutes;
    
    @Enumerated(EnumType.STRING)
    private TradeStatus status = TradeStatus.CLOSED;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private PaperTradingAccount account;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strategy_id")
    private Strategy strategy;
    
    @PrePersist
    protected void onCreate() {
        if (openTime != null && closeTime != null) {
            durationMinutes = java.time.Duration.between(openTime, closeTime).toMinutes();
        }
    }
    
    // Business methods
    public void calculatePnL() {
        if (side == TradeSide.BUY) {
            pnl = closePrice.subtract(openPrice).multiply(volume);
        } else {
            pnl = openPrice.subtract(closePrice).multiply(volume);
        }
        
        // Subtract commission and slippage
        pnl = pnl.subtract(commission).subtract(slippage);
        
        // Calculate percentage
        BigDecimal totalCost = openPrice.multiply(volume);
        if (totalCost.compareTo(BigDecimal.ZERO) > 0) {
            pnlPercent = pnl.divide(totalCost, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
    }
    
    public boolean isProfitable() {
        return pnl.compareTo(BigDecimal.ZERO) > 0;
    }
    
    public boolean isLong() {
        return side == TradeSide.BUY;
    }
    
    public boolean isShort() {
        return side == TradeSide.SELL;
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
    
    public TradeSide getSide() {
        return side;
    }
    
    public void setSide(TradeSide side) {
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
    
    public BigDecimal getClosePrice() {
        return closePrice;
    }
    
    public void setClosePrice(BigDecimal closePrice) {
        this.closePrice = closePrice;
    }
    
    public BigDecimal getPnl() {
        return pnl;
    }
    
    public void setPnl(BigDecimal pnl) {
        this.pnl = pnl;
    }
    
    public BigDecimal getPnlPercent() {
        return pnlPercent;
    }
    
    public void setPnlPercent(BigDecimal pnlPercent) {
        this.pnlPercent = pnlPercent;
    }
    
    public BigDecimal getCommission() {
        return commission;
    }
    
    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }
    
    public BigDecimal getSlippage() {
        return slippage;
    }
    
    public void setSlippage(BigDecimal slippage) {
        this.slippage = slippage;
    }
    
    public LocalDateTime getOpenTime() {
        return openTime;
    }
    
    public void setOpenTime(LocalDateTime openTime) {
        this.openTime = openTime;
    }
    
    public LocalDateTime getCloseTime() {
        return closeTime;
    }
    
    public void setCloseTime(LocalDateTime closeTime) {
        this.closeTime = closeTime;
    }
    
    public Long getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Long durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public TradeStatus getStatus() {
        return status;
    }
    
    public void setStatus(TradeStatus status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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
    
    public Strategy getStrategy() {
        return strategy;
    }
    
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }
    
    public enum TradeSide {
        BUY, SELL
    }
    
    public enum TradeStatus {
        OPEN, CLOSED, CANCELLED
    }
}