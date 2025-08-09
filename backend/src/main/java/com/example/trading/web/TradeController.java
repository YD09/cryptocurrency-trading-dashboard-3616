package com.example.trading.web;

import com.example.trading.config.SecurityConfig.CurrentUser;
import com.example.trading.domain.Trade;
import com.example.trading.market.MarketDataService;
import com.example.trading.repository.TradeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trades")
public class TradeController {
  private final TradeRepository tradeRepository;
  private final MarketDataService marketDataService;

  public TradeController(TradeRepository tradeRepository, MarketDataService marketDataService) {
    this.tradeRepository = tradeRepository;
    this.marketDataService = marketDataService;
  }

  @GetMapping
  public List<Trade> list(@AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(CurrentUser.getUserId(jwt));
    return tradeRepository.findByUserIdOrderByOpenTimeDesc(userId);
  }

  public record CreateTradeRequest(
    @NotBlank String symbol,
    @NotNull Trade.Side type,
    @NotNull BigDecimal volume,
    BigDecimal stopLoss,
    BigDecimal takeProfit
  ) {}

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Trade create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateTradeRequest req) {
    UUID userId = UUID.fromString(CurrentUser.getUserId(jwt));
    BigDecimal current = marketDataService.getLastPrice(req.symbol());

    Trade t = new Trade();
    t.setUserId(userId);
    t.setSymbol(req.symbol());
    t.setType(req.type());
    t.setVolume(req.volume());
    t.setOpenPrice(current);
    t.setCurrentPrice(current);
    t.setOpenTime(OffsetDateTime.now());
    t.setPnl(BigDecimal.ZERO);
    t.setPnlPercent(BigDecimal.ZERO);
    t.setStatus(Trade.Status.OPEN);
    t.setStopLoss(req.stopLoss());
    t.setTakeProfit(req.takeProfit());

    return tradeRepository.save(t);
  }

  @PostMapping("/{id}/close")
  public Trade close(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
    UUID userId = UUID.fromString(CurrentUser.getUserId(jwt));
    Trade t = tradeRepository.findById(id).orElseThrow();
    if (!t.getUserId().equals(userId)) {
      throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot close another user's trade");
    }
    BigDecimal last = marketDataService.getLastPrice(t.getSymbol());
    t.setClosePrice(last);
    t.setCloseTime(OffsetDateTime.now());
    BigDecimal direction = t.getType() == Trade.Side.BUY ? BigDecimal.ONE : BigDecimal.ONE.negate();
    BigDecimal pnl = last.subtract(t.getOpenPrice()).multiply(direction).multiply(t.getVolume());
    t.setFinalPnl(pnl);
    t.setStatus(Trade.Status.CLOSED);
    return tradeRepository.save(t);
  }
}