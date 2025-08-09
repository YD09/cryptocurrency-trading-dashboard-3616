package com.example.trading.market;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.stereotype.Service;

@Service
public class YahooMarketDataService implements MarketDataService {
  private final HttpClient httpClient = HttpClient.newHttpClient();
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public BigDecimal getLastPrice(String symbol) {
    try {
      String url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + symbol;
      HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      JsonNode root = objectMapper.readTree(response.body());
      JsonNode result = root.path("quoteResponse").path("result");
      if (result.isArray() && result.size() > 0) {
        JsonNode item = result.get(0);
        if (item.has("regularMarketPrice")) {
          return item.get("regularMarketPrice").decimalValue();
        }
      }
    } catch (Exception ignored) {}
    return BigDecimal.ZERO;
  }
}