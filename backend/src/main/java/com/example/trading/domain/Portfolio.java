package com.example.trading.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "portfolios")
public class Portfolio {
  @Id
  @Column(name = "id")
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "initialbalance", nullable = false)
  private BigDecimal initialBalance;

  @Column(name = "balance", nullable = false)
  private BigDecimal balance;

  @Column(name = "equity", nullable = false)
  private BigDecimal equity;

  @Column(name = "margin", nullable = false)
  private BigDecimal margin;

  @Column(name = "freemargin", nullable = false)
  private BigDecimal freeMargin;

  @Column(name = "marginlevel", nullable = false)
  private BigDecimal marginLevel;

  @Column(name = "pnl", nullable = false)
  private BigDecimal pnl;

  @Column(name = "totalprofit", nullable = false)
  private BigDecimal totalProfit;

  @Column(name = "totalloss", nullable = false)
  private BigDecimal totalLoss;

  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    if (id == null) id = UUID.randomUUID();
    createdAt = OffsetDateTime.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = OffsetDateTime.now();
  }

  // Getters and setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public UUID getUserId() { return userId; }
  public void setUserId(UUID userId) { this.userId = userId; }
  public BigDecimal getInitialBalance() { return initialBalance; }
  public void setInitialBalance(BigDecimal initialBalance) { this.initialBalance = initialBalance; }
  public BigDecimal getBalance() { return balance; }
  public void setBalance(BigDecimal balance) { this.balance = balance; }
  public BigDecimal getEquity() { return equity; }
  public void setEquity(BigDecimal equity) { this.equity = equity; }
  public BigDecimal getMargin() { return margin; }
  public void setMargin(BigDecimal margin) { this.margin = margin; }
  public BigDecimal getFreeMargin() { return freeMargin; }
  public void setFreeMargin(BigDecimal freeMargin) { this.freeMargin = freeMargin; }
  public BigDecimal getMarginLevel() { return marginLevel; }
  public void setMarginLevel(BigDecimal marginLevel) { this.marginLevel = marginLevel; }
  public BigDecimal getPnl() { return pnl; }
  public void setPnl(BigDecimal pnl) { this.pnl = pnl; }
  public BigDecimal getTotalProfit() { return totalProfit; }
  public void setTotalProfit(BigDecimal totalProfit) { this.totalProfit = totalProfit; }
  public BigDecimal getTotalLoss() { return totalLoss; }
  public void setTotalLoss(BigDecimal totalLoss) { this.totalLoss = totalLoss; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
  public OffsetDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}