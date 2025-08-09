package com.example.trading.web;

import com.example.trading.config.SecurityConfig.CurrentUser;
import com.example.trading.domain.Trade;
import com.example.trading.repository.TradeRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {
  private final TradeRepository tradeRepository;

  public PerformanceController(TradeRepository tradeRepository) {
    this.tradeRepository = tradeRepository;
  }

  public record DailyPnl(LocalDate date, BigDecimal pnl) {}

  @GetMapping
  public List<DailyPnl> history(@AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(CurrentUser.getUserId(jwt));
    List<Trade> trades = tradeRepository.findByUserIdOrderByOpenTimeDesc(userId);
    Map<LocalDate, BigDecimal> byDay = new TreeMap<>();
    for (Trade t : trades) {
      if (t.getStatus() == Trade.Status.CLOSED && t.getFinalPnl() != null && t.getCloseTime() != null) {
        LocalDate d = t.getCloseTime().atZoneSameInstant(ZoneOffset.UTC).toLocalDate();
        byDay.merge(d, t.getFinalPnl(), BigDecimal::add);
      }
    }
    List<DailyPnl> out = new ArrayList<>();
    for (var e : byDay.entrySet()) out.add(new DailyPnl(e.getKey(), e.getValue()));
    return out;
  }
}