package com.example.trading.service;

import com.example.trading.domain.Portfolio;
import com.example.trading.domain.Trade;
import com.example.trading.market.MarketDataService;
import com.example.trading.repository.PortfolioRepository;
import com.example.trading.repository.TradeRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PortfolioService {
  private final PortfolioRepository portfolioRepository;
  private final TradeRepository tradeRepository;
  private final MarketDataService marketDataService;

  public PortfolioService(PortfolioRepository portfolioRepository, TradeRepository tradeRepository, MarketDataService marketDataService) {
    this.portfolioRepository = portfolioRepository;
    this.tradeRepository = tradeRepository;
    this.marketDataService = marketDataService;
  }

  @Transactional(readOnly = true)
  public PortfolioSnapshot getRealtimeSnapshot(UUID userId) {
    Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(null);
    List<Trade> trades = tradeRepository.findByUserIdOrderByOpenTimeDesc(userId);

    BigDecimal equity = portfolio != null ? portfolio.getBalance() : BigDecimal.ZERO;
    BigDecimal runningPnl = BigDecimal.ZERO;

    for (Trade trade : trades) {
      if (trade.getStatus() == Trade.Status.OPEN) {
        BigDecimal last = marketDataService.getLastPrice(trade.getSymbol());
        if (last.signum() > 0) {
          BigDecimal direction = trade.getType() == Trade.Side.BUY ? BigDecimal.ONE : BigDecimal.ONE.negate();
          BigDecimal priceDiff = last.subtract(trade.getOpenPrice()).multiply(direction);
          BigDecimal pnl = priceDiff.multiply(trade.getVolume()).setScale(2, RoundingMode.HALF_UP);
          runningPnl = runningPnl.add(pnl);
          equity = equity.add(pnl);
        }
      }
    }

    BigDecimal marginLevel = BigDecimal.ZERO;
    BigDecimal freeMargin = portfolio != null ? portfolio.getBalance().subtract(portfolio.getMargin()) : BigDecimal.ZERO;

    return new PortfolioSnapshot(
      portfolio != null ? portfolio.getInitialBalance() : BigDecimal.ZERO,
      portfolio != null ? portfolio.getBalance() : BigDecimal.ZERO,
      equity,
      portfolio != null ? portfolio.getMargin() : BigDecimal.ZERO,
      freeMargin,
      marginLevel,
      runningPnl
    );
  }

  public record PortfolioSnapshot(
    BigDecimal initialBalance,
    BigDecimal balance,
    BigDecimal equity,
    BigDecimal margin,
    BigDecimal freeMargin,
    BigDecimal marginLevel,
    BigDecimal pnl
  ) {}
}