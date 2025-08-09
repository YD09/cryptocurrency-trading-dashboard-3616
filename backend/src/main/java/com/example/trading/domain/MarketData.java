package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_data", indexes = {
    @Index(name = "idx_symbol_timeframe_timestamp", columnList = "symbol, timeframe, timestamp"),
    @Index(name = "idx_timestamp", columnList = "timestamp")
})
public class MarketData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String symbol;
    
    @NotBlank
    private String timeframe;
    
    @NotNull
    private LocalDateTime timestamp;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal open;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal high;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal low;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal close;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal volume;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal vwap;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
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
    public BigDecimal getPriceRange() {
        return high.subtract(low);
    }
    
    public BigDecimal getBodySize() {
        return close.subtract(open).abs();
    }
    
    public BigDecimal getUpperShadow() {
        return high.subtract(open.max(close));
    }
    
    public BigDecimal getLowerShadow() {
        return open.min(close).subtract(low);
    }
    
    public boolean isBullish() {
        return close.compareTo(open) > 0;
    }
    
    public boolean isBearish() {
        return close.compareTo(open) < 0;
    }
    
    public boolean isDoji() {
        return open.compareTo(close) == 0;
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
    
    public String getTimeframe() {
        return timeframe;
    }
    
    public void setTimeframe(String timeframe) {
        this.timeframe = timeframe;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public BigDecimal getOpen() {
        return open;
    }
    
    public void setOpen(BigDecimal open) {
        this.open = open;
    }
    
    public BigDecimal getHigh() {
        return high;
    }
    
    public void setHigh(BigDecimal high) {
        this.high = high;
    }
    
    public BigDecimal getLow() {
        return low;
    }
    
    public void setLow(BigDecimal low) {
        this.low = low;
    }
    
    public BigDecimal getClose() {
        return close;
    }
    
    public void setClose(BigDecimal close) {
        this.close = close;
    }
    
    public BigDecimal getVolume() {
        return volume;
    }
    
    public void setVolume(BigDecimal volume) {
        this.volume = volume;
    }
    
    public BigDecimal getVwap() {
        return vwap;
    }
    
    public void setVwap(BigDecimal vwap) {
        this.vwap = vwap;
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
}