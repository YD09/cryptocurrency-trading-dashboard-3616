package com.example.trading.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paper_trading_executions")
public class PaperTradingExecution {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String symbol;
    
    @NotBlank
    private String timeframe;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private ExecutionSignal signal;
    
    @NotNull
    @Column(precision = 19, scale = 8)
    private BigDecimal price;
    
    @NotNull
    @Column(precision = 19, scale = 8)
    private BigDecimal volume;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal stopLoss;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal takeProfit;
    
    @Enumerated(EnumType.STRING)
    private ExecutionStatus status = ExecutionStatus.PENDING;
    
    @Column(name = "executed_at")
    private LocalDateTime executedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(columnDefinition = "TEXT")
    private String signalData;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strategy_id")
    private Strategy strategy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private PaperTradingAccount account;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToOne(mappedBy = "execution", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Order order;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Business methods
    public void execute() {
        this.status = ExecutionStatus.EXECUTED;
        this.executedAt = LocalDateTime.now();
    }
    
    public boolean isBuySignal() {
        return signal == ExecutionSignal.BUY || signal == ExecutionSignal.BUY_LONG;
    }
    
    public boolean isSellSignal() {
        return signal == ExecutionSignal.SELL || signal == ExecutionSignal.SELL_SHORT;
    }
    
    public boolean isExitSignal() {
        return signal == ExecutionSignal.EXIT_LONG || signal == ExecutionSignal.EXIT_SHORT;
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
    
    public ExecutionSignal getSignal() {
        return signal;
    }
    
    public void setSignal(ExecutionSignal signal) {
        this.signal = signal;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getVolume() {
        return volume;
    }
    
    public void setVolume(BigDecimal volume) {
        this.volume = volume;
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
    
    public ExecutionStatus getStatus() {
        return status;
    }
    
    public void setStatus(ExecutionStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getExecutedAt() {
        return executedAt;
    }
    
    public void setExecutedAt(LocalDateTime executedAt) {
        this.executedAt = executedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getSignalData() {
        return signalData;
    }
    
    public void setSignalData(String signalData) {
        this.signalData = signalData;
    }
    
    public Strategy getStrategy() {
        return strategy;
    }
    
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
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
    
    public enum ExecutionSignal {
        BUY, SELL, BUY_LONG, SELL_SHORT, EXIT_LONG, EXIT_SHORT, HOLD
    }
    
    public enum ExecutionStatus {
        PENDING, EXECUTED, FAILED, CANCELLED
    }
}