package com.example.trading.repository;

import com.example.trading.domain.Portfolio;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {
  Optional<Portfolio> findByUserId(UUID userId);
}