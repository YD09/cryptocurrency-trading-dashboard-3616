package com.example.trading.repository;

import com.example.trading.domain.MarketData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
    
    List<MarketData> findBySymbol(String symbol);
    
    List<MarketData> findBySymbolAndTimeframe(String symbol, String timeframe);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe ORDER BY m.timestamp DESC")
    List<MarketData> findBySymbolAndTimeframeOrderByTimestampDesc(@Param("symbol") String symbol, @Param("timeframe") String timeframe);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.timestamp >= :startTime ORDER BY m.timestamp ASC")
    List<MarketData> findBySymbolAndTimeframeAndTimestampAfter(@Param("symbol") String symbol, 
                                                              @Param("timeframe") String timeframe,
                                                              @Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.timestamp BETWEEN :startTime AND :endTime ORDER BY m.timestamp ASC")
    List<MarketData> findBySymbolAndTimeframeAndTimestampBetween(@Param("symbol") String symbol,
                                                                @Param("timeframe") String timeframe,
                                                                @Param("startTime") LocalDateTime startTime,
                                                                @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe ORDER BY m.timestamp DESC LIMIT 1")
    Optional<MarketData> findLatestBySymbolAndTimeframe(@Param("symbol") String symbol, @Param("timeframe") String timeframe);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe ORDER BY m.timestamp DESC")
    Page<MarketData> findBySymbolAndTimeframeOrderByTimestampDesc(@Param("symbol") String symbol, 
                                                                 @Param("timeframe") String timeframe,
                                                                 Pageable pageable);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.timestamp >= :since")
    List<MarketData> findBySymbolAndTimeframeAndTimestampAfter(@Param("symbol") String symbol,
                                                              @Param("timeframe") String timeframe,
                                                              @Param("since") LocalDateTime since);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.close >= :minPrice")
    List<MarketData> findBySymbolAndTimeframeAndMinClose(@Param("symbol") String symbol,
                                                        @Param("timeframe") String timeframe,
                                                        @Param("minPrice") BigDecimal minPrice);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.close <= :maxPrice")
    List<MarketData> findBySymbolAndTimeframeAndMaxClose(@Param("symbol") String symbol,
                                                        @Param("timeframe") String timeframe,
                                                        @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.volume >= :minVolume")
    List<MarketData> findBySymbolAndTimeframeAndMinVolume(@Param("symbol") String symbol,
                                                         @Param("timeframe") String timeframe,
                                                         @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.high = (SELECT MAX(m2.high) FROM MarketData m2 WHERE m2.symbol = :symbol AND m2.timeframe = :timeframe AND m2.timestamp >= :since)")
    List<MarketData> findHighestBySymbolAndTimeframeSince(@Param("symbol") String symbol,
                                                         @Param("timeframe") String timeframe,
                                                         @Param("since") LocalDateTime since);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.low = (SELECT MIN(m2.low) FROM MarketData m2 WHERE m2.symbol = :symbol AND m2.timeframe = :timeframe AND m2.timestamp >= :since)")
    List<MarketData> findLowestBySymbolAndTimeframeSince(@Param("symbol") String symbol,
                                                        @Param("timeframe") String timeframe,
                                                        @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(m) FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe")
    long countBySymbolAndTimeframe(@Param("symbol") String symbol, @Param("timeframe") String timeframe);
    
    @Query("SELECT COUNT(m) FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.timestamp >= :since")
    long countBySymbolAndTimeframeSince(@Param("symbol") String symbol, 
                                       @Param("timeframe") String timeframe,
                                       @Param("since") LocalDateTime since);
    
    @Query("SELECT DISTINCT m.symbol FROM MarketData m")
    List<String> findAllSymbols();
    
    @Query("SELECT DISTINCT m.timeframe FROM MarketData m WHERE m.symbol = :symbol")
    List<String> findTimeframesBySymbol(@Param("symbol") String symbol);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.timestamp = (SELECT MAX(m2.timestamp) FROM MarketData m2 WHERE m2.symbol = :symbol AND m2.timeframe = :timeframe)")
    Optional<MarketData> findMostRecentBySymbolAndTimeframe(@Param("symbol") String symbol, @Param("timeframe") String timeframe);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.timestamp < :timestamp ORDER BY m.timestamp DESC LIMIT 1")
    Optional<MarketData> findPreviousBySymbolAndTimeframeAndTimestamp(@Param("symbol") String symbol,
                                                                     @Param("timeframe") String timeframe,
                                                                     @Param("timestamp") LocalDateTime timestamp);
    
    @Query("SELECT m FROM MarketData m WHERE m.symbol = :symbol AND m.timeframe = :timeframe AND m.timestamp > :timestamp ORDER BY m.timestamp ASC LIMIT 1")
    Optional<MarketData> findNextBySymbolAndTimeframeAndTimestamp(@Param("symbol") String symbol,
                                                                 @Param("timeframe") String timeframe,
                                                                 @Param("timestamp") LocalDateTime timestamp);
}