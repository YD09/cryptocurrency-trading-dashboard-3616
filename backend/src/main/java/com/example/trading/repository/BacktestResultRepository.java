package com.example.trading.repository;

import com.example.trading.domain.BacktestResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BacktestResultRepository extends JpaRepository<BacktestResult, Long> {
    
    List<BacktestResult> findByStrategyId(Long strategyId);
    
    Page<BacktestResult> findByStrategyId(Long strategyId, Pageable pageable);
    
    List<BacktestResult> findByUserId(Long userId);
    
    List<BacktestResult> findByStrategyIdAndStatus(Long strategyId, BacktestResult.BacktestStatus status);
    
    List<BacktestResult> findByUserIdAndStatus(Long userId, BacktestResult.BacktestStatus status);
    
    List<BacktestResult> findByStrategyIdAndSymbol(Long strategyId, String symbol);
    
    List<BacktestResult> findByUserIdAndSymbol(Long userId, String symbol);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.totalReturn >= :minReturn")
    List<BacktestResult> findByStrategyIdAndMinReturn(@Param("strategyId") Long strategyId, @Param("minReturn") BigDecimal minReturn);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId AND b.totalReturn >= :minReturn")
    List<BacktestResult> findByUserIdAndMinReturn(@Param("userId") Long userId, @Param("minReturn") BigDecimal minReturn);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.winRate >= :minWinRate")
    List<BacktestResult> findByStrategyIdAndMinWinRate(@Param("strategyId") Long strategyId, @Param("minWinRate") BigDecimal minWinRate);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId AND b.winRate >= :minWinRate")
    List<BacktestResult> findByUserIdAndMinWinRate(@Param("userId") Long userId, @Param("minWinRate") BigDecimal minWinRate);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.maxDrawdown <= :maxDrawdown")
    List<BacktestResult> findByStrategyIdAndMaxDrawdown(@Param("strategyId") Long strategyId, @Param("maxDrawdown") BigDecimal maxDrawdown);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId AND b.maxDrawdown <= :maxDrawdown")
    List<BacktestResult> findByUserIdAndMaxDrawdown(@Param("userId") Long userId, @Param("maxDrawdown") BigDecimal maxDrawdown);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.profitFactor >= :minProfitFactor")
    List<BacktestResult> findByStrategyIdAndMinProfitFactor(@Param("strategyId") Long strategyId, @Param("minProfitFactor") BigDecimal minProfitFactor);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId AND b.profitFactor >= :minProfitFactor")
    List<BacktestResult> findByUserIdAndMinProfitFactor(@Param("userId") Long userId, @Param("minProfitFactor") BigDecimal minProfitFactor);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.createdAt >= :since")
    List<BacktestResult> findByStrategyIdAndCreatedSince(@Param("strategyId") Long strategyId, @Param("since") LocalDateTime since);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId AND b.createdAt >= :since")
    List<BacktestResult> findByUserIdAndCreatedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId ORDER BY b.totalReturn DESC")
    List<BacktestResult> findByStrategyIdOrderByTotalReturnDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId ORDER BY b.totalReturn DESC")
    List<BacktestResult> findByUserIdOrderByTotalReturnDesc(@Param("userId") Long userId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId ORDER BY b.winRate DESC")
    List<BacktestResult> findByStrategyIdOrderByWinRateDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId ORDER BY b.winRate DESC")
    List<BacktestResult> findByUserIdOrderByWinRateDesc(@Param("userId") Long userId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId ORDER BY b.maxDrawdown ASC")
    List<BacktestResult> findByStrategyIdOrderByMaxDrawdownAsc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId ORDER BY b.maxDrawdown ASC")
    List<BacktestResult> findByUserIdOrderByMaxDrawdownAsc(@Param("userId") Long userId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId ORDER BY b.createdAt DESC")
    List<BacktestResult> findByStrategyIdOrderByCreatedAtDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<BacktestResult> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(b) FROM BacktestResult b WHERE b.strategy.id = :strategyId")
    long countByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT COUNT(b) FROM BacktestResult b WHERE b.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(b) FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.status = :status")
    long countByStrategyIdAndStatus(@Param("strategyId") Long strategyId, @Param("status") BacktestResult.BacktestStatus status);
    
    @Query("SELECT COUNT(b) FROM BacktestResult b WHERE b.user.id = :userId AND b.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") BacktestResult.BacktestStatus status);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.totalReturn > 0")
    List<BacktestResult> findProfitableByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId AND b.totalReturn > 0")
    List<BacktestResult> findProfitableByUserId(@Param("userId") Long userId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.totalReturn < 0")
    List<BacktestResult> findLosingByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.user.id = :userId AND b.totalReturn < 0")
    List<BacktestResult> findLosingByUserId(@Param("userId") Long userId);
    
    @Query("SELECT b FROM BacktestResult b WHERE b.strategy.id = :strategyId AND b.symbol = :symbol AND b.timeframe = :timeframe")
    List<BacktestResult> findByStrategyIdAndSymbolAndTimeframe(@Param("strategyId") Long strategyId,
                                                              @Param("symbol") String symbol,
                                                              @Param("timeframe") String timeframe);
}