package com.example.trading.web;

import com.example.trading.config.SecurityConfig.CurrentUser;
import com.example.trading.service.PortfolioService;
import com.example.trading.service.PortfolioService.PortfolioSnapshot;
import java.io.IOException;
import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
  private final PortfolioService portfolioService;

  public PortfolioController(PortfolioService portfolioService) {
    this.portfolioService = portfolioService;
  }

  @GetMapping
  public PortfolioSnapshot getSnapshot(@AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(CurrentUser.getUserId(jwt));
    return portfolioService.getRealtimeSnapshot(userId);
  }

  @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter streamSnapshot(@AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(CurrentUser.getUserId(jwt));
    SseEmitter emitter = new SseEmitter(0L);

    var exec = Executors.newSingleThreadScheduledExecutor();
    exec.scheduleAtFixedRate(() -> {
      try {
        PortfolioSnapshot snap = portfolioService.getRealtimeSnapshot(userId);
        emitter.send(SseEmitter.event().name("snapshot").data(snap));
      } catch (IOException e) {
        emitter.completeWithError(e);
      }
    }, 0, 5, TimeUnit.SECONDS);

    // Auto-complete after 10 minutes
    exec.schedule(() -> {
      emitter.complete();
      exec.shutdownNow();
    }, Duration.ofMinutes(10).toSeconds(), TimeUnit.SECONDS);

    emitter.onCompletion(exec::shutdownNow);
    emitter.onTimeout(exec::shutdownNow);
    return emitter;
  }
}