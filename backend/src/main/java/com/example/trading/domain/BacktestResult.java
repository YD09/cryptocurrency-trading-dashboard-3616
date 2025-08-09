package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "backtest_results")
public class BacktestResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String symbol;
    
    @NotBlank
    private String timeframe;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal initialBalance;
    
    @NotNull
    @Positive
    @Column(precision = 19, scale = 8)
    private BigDecimal finalBalance;
    
    @NotNull
    @Column(precision = 19, scale = 8)
    private BigDecimal totalPnL;
    
    @NotNull
    @Column(precision = 5, scale = 2)
    private BigDecimal totalReturn;
    
    @NotNull
    @Column(precision = 5, scale = 2)
    private BigDecimal maxDrawdown;
    
    @NotNull
    @Positive
    private Integer totalTrades;
    
    @NotNull
    @Positive
    private Integer winningTrades;
    
    @NotNull
    @Positive
    private Integer losingTrades;
    
    @NotNull
    @Column(precision = 5, scale = 2)
    private BigDecimal winRate;
    
    @NotNull
    @Column(precision = 19, scale = 8)
    private BigDecimal averageWin;
    
    @NotNull
    @Column(precision = 19, scale = 8)
    private BigDecimal averageLoss;
    
    @NotNull
    @Column(precision = 5, scale = 2)
    private BigDecimal profitFactor;
    
    @NotNull
    @Column(precision = 5, scale = 2)
    private BigDecimal sharpeRatio;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(columnDefinition = "TEXT")
    private String equityCurve;
    
    @Column(columnDefinition = "TEXT")
    private String parameters;
    
    @Enumerated(EnumType.STRING)
    private BacktestStatus status = BacktestStatus.COMPLETED;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strategy_id")
    private Strategy strategy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Business methods
    public void calculateMetrics() {
        // Calculate win rate
        if (totalTrades > 0) {
            winRate = BigDecimal.valueOf(winningTrades)
                    .divide(BigDecimal.valueOf(totalTrades), 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        
        // Calculate total return
        if (initialBalance.compareTo(BigDecimal.ZERO) > 0) {
            totalReturn = totalPnL.divide(initialBalance, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        
        // Calculate profit factor
        if (averageLoss.compareTo(BigDecimal.ZERO) != 0) {
            profitFactor = averageWin.multiply(BigDecimal.valueOf(winningTrades))
                    .divide(averageLoss.multiply(BigDecimal.valueOf(losingTrades)), 2, BigDecimal.ROUND_HALF_UP);
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
    
    public String getTimeframe() {
        return timeframe;
    }
    
    public void setTimeframe(String timeframe) {
        this.timeframe = timeframe;
    }
    
    public BigDecimal getInitialBalance() {
        return initialBalance;
    }
    
    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }
    
    public BigDecimal getFinalBalance() {
        return finalBalance;
    }
    
    public void setFinalBalance(BigDecimal finalBalance) {
        this.finalBalance = finalBalance;
    }
    
    public BigDecimal getTotalPnL() {
        return totalPnL;
    }
    
    public void setTotalPnL(BigDecimal totalPnL) {
        this.totalPnL = totalPnL;
    }
    
    public BigDecimal getTotalReturn() {
        return totalReturn;
    }
    
    public void setTotalReturn(BigDecimal totalReturn) {
        this.totalReturn = totalReturn;
    }
    
    public BigDecimal getMaxDrawdown() {
        return maxDrawdown;
    }
    
    public void setMaxDrawdown(BigDecimal maxDrawdown) {
        this.maxDrawdown = maxDrawdown;
    }
    
    public Integer getTotalTrades() {
        return totalTrades;
    }
    
    public void setTotalTrades(Integer totalTrades) {
        this.totalTrades = totalTrades;
    }
    
    public Integer getWinningTrades() {
        return winningTrades;
    }
    
    public void setWinningTrades(Integer winningTrades) {
        this.winningTrades = winningTrades;
    }
    
    public Integer getLosingTrades() {
        return losingTrades;
    }
    
    public void setLosingTrades(Integer losingTrades) {
        this.losingTrades = losingTrades;
    }
    
    public BigDecimal getWinRate() {
        return winRate;
    }
    
    public void setWinRate(BigDecimal winRate) {
        this.winRate = winRate;
    }
    
    public BigDecimal getAverageWin() {
        return averageWin;
    }
    
    public void setAverageWin(BigDecimal averageWin) {
        this.averageWin = averageWin;
    }
    
    public BigDecimal getAverageLoss() {
        return averageLoss;
    }
    
    public void setAverageLoss(BigDecimal averageLoss) {
        this.averageLoss = averageLoss;
    }
    
    public BigDecimal getProfitFactor() {
        return profitFactor;
    }
    
    public void setProfitFactor(BigDecimal profitFactor) {
        this.profitFactor = profitFactor;
    }
    
    public BigDecimal getSharpeRatio() {
        return sharpeRatio;
    }
    
    public void setSharpeRatio(BigDecimal sharpeRatio) {
        this.sharpeRatio = sharpeRatio;
    }
    
    public LocalDateTime getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    
    public LocalDateTime getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getEquityCurve() {
        return equityCurve;
    }
    
    public void setEquityCurve(String equityCurve) {
        this.equityCurve = equityCurve;
    }
    
    public String getParameters() {
        return parameters;
    }
    
    public void setParameters(String parameters) {
        this.parameters = parameters;
    }
    
    public BacktestStatus getStatus() {
        return status;
    }
    
    public void setStatus(BacktestStatus status) {
        this.status = status;
    }
    
    public Strategy getStrategy() {
        return strategy;
    }
    
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public enum BacktestStatus {
        RUNNING, COMPLETED, FAILED, CANCELLED
    }
}