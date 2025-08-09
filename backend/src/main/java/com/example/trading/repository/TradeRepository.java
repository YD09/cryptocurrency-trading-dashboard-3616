package com.example.trading.repository;

import com.example.trading.domain.Trade;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TradeRepository extends JpaRepository<Trade, UUID> {
  List<Trade> findByUserIdOrderByOpenTimeDesc(UUID userId);
}