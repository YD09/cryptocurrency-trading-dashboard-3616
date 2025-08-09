package com.example.trading.web;

import com.example.trading.service.PortfolioService;
import com.example.trading.service.PortfolioService.PortfolioSnapshot;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
  private final PortfolioService portfolioService;

  public HomeController(PortfolioService portfolioService) {
    this.portfolioService = portfolioService;
  }

  @GetMapping("/")
  public String home(@AuthenticationPrincipal OidcUser user, Model model) {
    model.addAttribute("user", user);
    if (user != null) {
      var userId = user.getSubject();
      PortfolioSnapshot snap = portfolioService.getRealtimeSnapshot(java.util.UUID.fromString(userId));
      model.addAttribute("snapshot", snap);
    }
    return "index";
  }

  @GetMapping("/login")
  public String login() { return "login"; }
}