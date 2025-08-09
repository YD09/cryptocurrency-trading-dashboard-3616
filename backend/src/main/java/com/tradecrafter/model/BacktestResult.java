package com.tradecrafter.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "backtest_results")
public class BacktestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String symbol;
    
    @Column(nullable = false)
    private String timeframe;
    
    @Column(nullable = false)
    private LocalDateTime startDate;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal initialBalance;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal finalBalance;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal totalReturn;
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal returnPercentage;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal maxDrawdown;
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal maxDrawdownPercentage;
    
    @Column(nullable = false)
    private Integer totalTrades;
    
    @Column(nullable = false)
    private Integer winningTrades;
    
    @Column(nullable = false)
    private Integer losingTrades;
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal winRate;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal averageWin;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal averageLoss;
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal profitFactor;
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal sharpeRatio;
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal sortinoRatio;
    
    @Column(nullable = false)
    private Long executionTimeMs;
    
    @Column(nullable = false)
    private Integer barsProcessed;
    
    @Column(columnDefinition = "TEXT")
    private String equityCurve; // JSON array of equity values
    
    @Column(columnDefinition = "TEXT")
    private String parameters; // JSON of strategy parameters used
    
    @Column(columnDefinition = "TEXT")
    private String tradeDetails; // JSON array of trade details
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pine_script_id", nullable = false)
    private PineScript pineScript;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Constructors
    public BacktestResult() {}
    
    public BacktestResult(String symbol, String timeframe, LocalDateTime startDate, 
                         LocalDateTime endDate, PineScript pineScript, User user) {
        this.symbol = symbol;
        this.timeframe = timeframe;
        this.startDate = startDate;
        this.endDate = endDate;
        this.pineScript = pineScript;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    
    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    
    public BigDecimal getInitialBalance() { return initialBalance; }
    public void setInitialBalance(BigDecimal initialBalance) { this.initialBalance = initialBalance; }
    
    public BigDecimal getFinalBalance() { return finalBalance; }
    public void setFinalBalance(BigDecimal finalBalance) { this.finalBalance = finalBalance; }
    
    public BigDecimal getTotalReturn() { return totalReturn; }
    public void setTotalReturn(BigDecimal totalReturn) { this.totalReturn = totalReturn; }
    
    public BigDecimal getReturnPercentage() { return returnPercentage; }
    public void setReturnPercentage(BigDecimal returnPercentage) { this.returnPercentage = returnPercentage; }
    
    public BigDecimal getMaxDrawdown() { return maxDrawdown; }
    public void setMaxDrawdown(BigDecimal maxDrawdown) { this.maxDrawdown = maxDrawdown; }
    
    public BigDecimal getMaxDrawdownPercentage() { return maxDrawdownPercentage; }
    public void setMaxDrawdownPercentage(BigDecimal maxDrawdownPercentage) { this.maxDrawdownPercentage = maxDrawdownPercentage; }
    
    public Integer getTotalTrades() { return totalTrades; }
    public void setTotalTrades(Integer totalTrades) { this.totalTrades = totalTrades; }
    
    public Integer getWinningTrades() { return winningTrades; }
    public void setWinningTrades(Integer winningTrades) { this.winningTrades = winningTrades; }
    
    public Integer getLosingTrades() { return losingTrades; }
    public void setLosingTrades(Integer losingTrades) { this.losingTrades = losingTrades; }
    
    public BigDecimal getWinRate() { return winRate; }
    public void setWinRate(BigDecimal winRate) { this.winRate = winRate; }
    
    public BigDecimal getAverageWin() { return averageWin; }
    public void setAverageWin(BigDecimal averageWin) { this.averageWin = averageWin; }
    
    public BigDecimal getAverageLoss() { return averageLoss; }
    public void setAverageLoss(BigDecimal averageLoss) { this.averageLoss = averageLoss; }
    
    public BigDecimal getProfitFactor() { return profitFactor; }
    public void setProfitFactor(BigDecimal profitFactor) { this.profitFactor = profitFactor; }
    
    public BigDecimal getSharpeRatio() { return sharpeRatio; }
    public void setSharpeRatio(BigDecimal sharpeRatio) { this.sharpeRatio = sharpeRatio; }
    
    public BigDecimal getSortinoRatio() { return sortinoRatio; }
    public void setSortinoRatio(BigDecimal sortinoRatio) { this.sortinoRatio = sortinoRatio; }
    
    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }
    
    public Integer getBarsProcessed() { return barsProcessed; }
    public void setBarsProcessed(Integer barsProcessed) { this.barsProcessed = barsProcessed; }
    
    public String getEquityCurve() { return equityCurve; }
    public void setEquityCurve(String equityCurve) { this.equityCurve = equityCurve; }
    
    public String getParameters() { return parameters; }
    public void setParameters(String parameters) { this.parameters = parameters; }
    
    public String getTradeDetails() { return tradeDetails; }
    public void setTradeDetails(String tradeDetails) { this.tradeDetails = tradeDetails; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public PineScript getPineScript() { return pineScript; }
    public void setPineScript(PineScript pineScript) { this.pineScript = pineScript; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}