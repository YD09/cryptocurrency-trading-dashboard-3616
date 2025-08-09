package com.tradecrafter.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String symbol;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TradeType type;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal quantity;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal entryPrice;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal exitPrice;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal stopLoss;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal takeProfit;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal commission = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal realizedPnl;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal unrealizedPnl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TradeStatus status = TradeStatus.OPEN;
    
    @Column(nullable = false)
    private LocalDateTime openTime = LocalDateTime.now();
    
    @Column
    private LocalDateTime closeTime;
    
    @Column(length = 1000)
    private String notes;
    
    // Strategy execution context
    @Column
    private String strategyName;
    
    @Column
    private String executionContext;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trading_account_id", nullable = false)
    private TradingAccount tradingAccount;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pine_script_id")
    private PineScript pineScript;
    
    // Constructors
    public Trade() {}
    
    public Trade(String symbol, TradeType type, BigDecimal quantity, 
                 BigDecimal entryPrice, TradingAccount tradingAccount) {
        this.symbol = symbol;
        this.type = type;
        this.quantity = quantity;
        this.entryPrice = entryPrice;
        this.tradingAccount = tradingAccount;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    
    public TradeType getType() { return type; }
    public void setType(TradeType type) { this.type = type; }
    
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    
    public BigDecimal getEntryPrice() { return entryPrice; }
    public void setEntryPrice(BigDecimal entryPrice) { this.entryPrice = entryPrice; }
    
    public BigDecimal getExitPrice() { return exitPrice; }
    public void setExitPrice(BigDecimal exitPrice) { this.exitPrice = exitPrice; }
    
    public BigDecimal getStopLoss() { return stopLoss; }
    public void setStopLoss(BigDecimal stopLoss) { this.stopLoss = stopLoss; }
    
    public BigDecimal getTakeProfit() { return takeProfit; }
    public void setTakeProfit(BigDecimal takeProfit) { this.takeProfit = takeProfit; }
    
    public BigDecimal getCommission() { return commission; }
    public void setCommission(BigDecimal commission) { this.commission = commission; }
    
    public BigDecimal getRealizedPnl() { return realizedPnl; }
    public void setRealizedPnl(BigDecimal realizedPnl) { this.realizedPnl = realizedPnl; }
    
    public BigDecimal getUnrealizedPnl() { return unrealizedPnl; }
    public void setUnrealizedPnl(BigDecimal unrealizedPnl) { this.unrealizedPnl = unrealizedPnl; }
    
    public TradeStatus getStatus() { return status; }
    public void setStatus(TradeStatus status) { this.status = status; }
    
    public LocalDateTime getOpenTime() { return openTime; }
    public void setOpenTime(LocalDateTime openTime) { this.openTime = openTime; }
    
    public LocalDateTime getCloseTime() { return closeTime; }
    public void setCloseTime(LocalDateTime closeTime) { this.closeTime = closeTime; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getStrategyName() { return strategyName; }
    public void setStrategyName(String strategyName) { this.strategyName = strategyName; }
    
    public String getExecutionContext() { return executionContext; }
    public void setExecutionContext(String executionContext) { this.executionContext = executionContext; }
    
    public TradingAccount getTradingAccount() { return tradingAccount; }
    public void setTradingAccount(TradingAccount tradingAccount) { this.tradingAccount = tradingAccount; }
    
    public PineScript getPineScript() { return pineScript; }
    public void setPineScript(PineScript pineScript) { this.pineScript = pineScript; }
}

enum TradeType {
    BUY, SELL
}

enum TradeStatus {
    OPEN, CLOSED, CANCELLED
}