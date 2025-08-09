package com.example.trading.market;

import java.math.BigDecimal;

public interface MarketDataService {
  BigDecimal getLastPrice(String symbol);
}