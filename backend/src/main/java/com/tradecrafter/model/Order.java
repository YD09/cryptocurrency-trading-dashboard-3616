package com.tradecrafter.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String symbol;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSide side;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal quantity;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal price;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal stopPrice;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal stopLoss;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal takeProfit;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal filledQuantity = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 8)
    private BigDecimal avgFillPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeInForce timeInForce = TimeInForce.GTC;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime expiredAt;
    
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
    public Order() {}
    
    public Order(String symbol, OrderType orderType, OrderSide side, 
                 BigDecimal quantity, TradingAccount tradingAccount) {
        this.symbol = symbol;
        this.orderType = orderType;
        this.side = side;
        this.quantity = quantity;
        this.tradingAccount = tradingAccount;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    
    public OrderType getOrderType() { return orderType; }
    public void setOrderType(OrderType orderType) { this.orderType = orderType; }
    
    public OrderSide getSide() { return side; }
    public void setSide(OrderSide side) { this.side = side; }
    
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getStopPrice() { return stopPrice; }
    public void setStopPrice(BigDecimal stopPrice) { this.stopPrice = stopPrice; }
    
    public BigDecimal getStopLoss() { return stopLoss; }
    public void setStopLoss(BigDecimal stopLoss) { this.stopLoss = stopLoss; }
    
    public BigDecimal getTakeProfit() { return takeProfit; }
    public void setTakeProfit(BigDecimal takeProfit) { this.takeProfit = takeProfit; }
    
    public BigDecimal getFilledQuantity() { return filledQuantity; }
    public void setFilledQuantity(BigDecimal filledQuantity) { this.filledQuantity = filledQuantity; }
    
    public BigDecimal getAvgFillPrice() { return avgFillPrice; }
    public void setAvgFillPrice(BigDecimal avgFillPrice) { this.avgFillPrice = avgFillPrice; }
    
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    
    public TimeInForce getTimeInForce() { return timeInForce; }
    public void setTimeInForce(TimeInForce timeInForce) { this.timeInForce = timeInForce; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getExpiredAt() { return expiredAt; }
    public void setExpiredAt(LocalDateTime expiredAt) { this.expiredAt = expiredAt; }
    
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
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

enum OrderType {
    MARKET, LIMIT, STOP, STOP_LIMIT
}

enum OrderSide {
    BUY, SELL
}

enum OrderStatus {
    PENDING, PARTIAL_FILLED, FILLED, CANCELLED, REJECTED, EXPIRED
}

enum TimeInForce {
    GTC, // Good Till Cancel
    GTD, // Good Till Date
    IOC, // Immediate or Cancel
    FOK  // Fill or Kill
}