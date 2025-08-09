package com.example.trading.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "trades")
public class Trade {
  public enum Side { BUY, SELL }
  public enum Status { OPEN, CLOSED }

  @Id
  @Column(name = "id")
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "symbol", nullable = false)
  private String symbol;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private Side type;

  @Column(name = "volume", nullable = false)
  private BigDecimal volume;

  @Column(name = "openprice", nullable = false)
  private BigDecimal openPrice;

  @Column(name = "currentprice", nullable = false)
  private BigDecimal currentPrice;

  @Column(name = "opentime", nullable = false)
  private OffsetDateTime openTime;

  @Column(name = "closetime")
  private OffsetDateTime closeTime;

  @Column(name = "pnl", nullable = false)
  private BigDecimal pnl;

  @Column(name = "pnlpercent", nullable = false)
  private BigDecimal pnlPercent;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private Status status;

  @Column(name = "stoploss")
  private BigDecimal stopLoss;

  @Column(name = "takeprofit")
  private BigDecimal takeProfit;

  @Column(name = "closeprice")
  private BigDecimal closePrice;

  @Column(name = "finalpnl")
  private BigDecimal finalPnl;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    if (id == null) id = UUID.randomUUID();
    if (status == null) status = Status.OPEN;
    if (pnl == null) pnl = BigDecimal.ZERO;
    if (pnlPercent == null) pnlPercent = BigDecimal.ZERO;
    if (openTime == null) openTime = OffsetDateTime.now();
    createdAt = OffsetDateTime.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = OffsetDateTime.now();
  }

  // Getters and setters omitted for brevity
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public UUID getUserId() { return userId; }
  public void setUserId(UUID userId) { this.userId = userId; }
  public String getSymbol() { return symbol; }
  public void setSymbol(String symbol) { this.symbol = symbol; }
  public Side getType() { return type; }
  public void setType(Side type) { this.type = type; }
  public BigDecimal getVolume() { return volume; }
  public void setVolume(BigDecimal volume) { this.volume = volume; }
  public BigDecimal getOpenPrice() { return openPrice; }
  public void setOpenPrice(BigDecimal openPrice) { this.openPrice = openPrice; }
  public BigDecimal getCurrentPrice() { return currentPrice; }
  public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
  public OffsetDateTime getOpenTime() { return openTime; }
  public void setOpenTime(OffsetDateTime openTime) { this.openTime = openTime; }
  public OffsetDateTime getCloseTime() { return closeTime; }
  public void setCloseTime(OffsetDateTime closeTime) { this.closeTime = closeTime; }
  public BigDecimal getPnl() { return pnl; }
  public void setPnl(BigDecimal pnl) { this.pnl = pnl; }
  public BigDecimal getPnlPercent() { return pnlPercent; }
  public void setPnlPercent(BigDecimal pnlPercent) { this.pnlPercent = pnlPercent; }
  public Status getStatus() { return status; }
  public void setStatus(Status status) { this.status = status; }
  public BigDecimal getStopLoss() { return stopLoss; }
  public void setStopLoss(BigDecimal stopLoss) { this.stopLoss = stopLoss; }
  public BigDecimal getTakeProfit() { return takeProfit; }
  public void setTakeProfit(BigDecimal takeProfit) { this.takeProfit = takeProfit; }
  public BigDecimal getClosePrice() { return closePrice; }
  public void setClosePrice(BigDecimal closePrice) { this.closePrice = closePrice; }
  public BigDecimal getFinalPnl() { return finalPnl; }
  public void setFinalPnl(BigDecimal finalPnl) { this.finalPnl = finalPnl; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
  public OffsetDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}