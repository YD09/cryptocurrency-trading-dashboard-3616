package com.example.trading.repository;

import com.example.trading.domain.Trade;
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
public interface TradeRepository extends JpaRepository<Trade, Long> {
    
    List<Trade> findByAccountId(Long accountId);
    
    Page<Trade> findByAccountId(Long accountId, Pageable pageable);
    
    List<Trade> findByUserId(Long userId);
    
    List<Trade> findByStrategyId(Long strategyId);
    
    List<Trade> findByAccountIdAndStatus(Long accountId, Trade.TradeStatus status);
    
    List<Trade> findByUserIdAndStatus(Long userId, Trade.TradeStatus status);
    
    List<Trade> findByStrategyIdAndStatus(Long strategyId, Trade.TradeStatus status);
    
    List<Trade> findByAccountIdAndSymbol(Long accountId, String symbol);
    
    List<Trade> findByUserIdAndSymbol(Long userId, String symbol);
    
    List<Trade> findByStrategyIdAndSymbol(Long strategyId, String symbol);
    
    List<Trade> findByAccountIdAndSide(Long accountId, Trade.TradeSide side);
    
    List<Trade> findByUserIdAndSide(Long userId, Trade.TradeSide side);
    
    List<Trade> findByStrategyIdAndSide(Long strategyId, Trade.TradeSide side);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId AND t.pnl > 0")
    List<Trade> findProfitableByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId AND t.pnl > 0")
    List<Trade> findProfitableByUserId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId AND t.pnl > 0")
    List<Trade> findProfitableByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId AND t.pnl < 0")
    List<Trade> findLosingByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId AND t.pnl < 0")
    List<Trade> findLosingByUserId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId AND t.pnl < 0")
    List<Trade> findLosingByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId AND t.openTime >= :since")
    List<Trade> findByAccountIdAndOpenedSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId AND t.openTime >= :since")
    List<Trade> findByUserIdAndOpenedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId AND t.openTime >= :since")
    List<Trade> findByStrategyIdAndOpenedSince(@Param("strategyId") Long strategyId, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId AND t.closeTime >= :since")
    List<Trade> findByAccountIdAndClosedSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId AND t.closeTime >= :since")
    List<Trade> findByUserIdAndClosedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId AND t.closeTime >= :since")
    List<Trade> findByStrategyIdAndClosedSince(@Param("strategyId") Long strategyId, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId AND t.volume >= :minVolume")
    List<Trade> findByAccountIdAndMinVolume(@Param("accountId") Long accountId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId AND t.volume >= :minVolume")
    List<Trade> findByUserIdAndMinVolume(@Param("userId") Long userId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId AND t.volume >= :minVolume")
    List<Trade> findByStrategyIdAndMinVolume(@Param("strategyId") Long strategyId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId AND t.pnl >= :minPnL")
    List<Trade> findByAccountIdAndMinPnL(@Param("accountId") Long accountId, @Param("minPnL") BigDecimal minPnL);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId AND t.pnl >= :minPnL")
    List<Trade> findByUserIdAndMinPnL(@Param("userId") Long userId, @Param("minPnL") BigDecimal minPnL);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId AND t.pnl >= :minPnL")
    List<Trade> findByStrategyIdAndMinPnL(@Param("strategyId") Long strategyId, @Param("minPnL") BigDecimal minPnL);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId ORDER BY t.openTime DESC")
    List<Trade> findByAccountIdOrderByOpenTimeDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId ORDER BY t.openTime DESC")
    List<Trade> findByUserIdOrderByOpenTimeDesc(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId ORDER BY t.openTime DESC")
    List<Trade> findByStrategyIdOrderByOpenTimeDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId ORDER BY t.pnl DESC")
    List<Trade> findByAccountIdOrderByPnLDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId ORDER BY t.pnl DESC")
    List<Trade> findByUserIdOrderByPnLDesc(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId ORDER BY t.pnl DESC")
    List<Trade> findByStrategyIdOrderByPnLDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId ORDER BY t.volume DESC")
    List<Trade> findByAccountIdOrderByVolumeDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId ORDER BY t.volume DESC")
    List<Trade> findByUserIdOrderByVolumeDesc(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId ORDER BY t.volume DESC")
    List<Trade> findByStrategyIdOrderByVolumeDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.account.id = :accountId")
    long countByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.strategy.id = :strategyId")
    long countByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.account.id = :accountId AND t.status = :status")
    long countByAccountIdAndStatus(@Param("accountId") Long accountId, @Param("status") Trade.TradeStatus status);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.user.id = :userId AND t.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Trade.TradeStatus status);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.strategy.id = :strategyId AND t.status = :status")
    long countByStrategyIdAndStatus(@Param("strategyId") Long strategyId, @Param("status") Trade.TradeStatus status);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.account.id = :accountId AND t.pnl > 0")
    long countProfitableByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.user.id = :userId AND t.pnl > 0")
    long countProfitableByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.strategy.id = :strategyId AND t.pnl > 0")
    long countProfitableByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.account.id = :accountId AND t.pnl < 0")
    long countLosingByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.user.id = :userId AND t.pnl < 0")
    long countLosingByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.strategy.id = :strategyId AND t.pnl < 0")
    long countLosingByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT t FROM Trade t WHERE t.account.id = :accountId AND t.symbol = :symbol AND t.side = :side")
    List<Trade> findByAccountIdAndSymbolAndSide(@Param("accountId") Long accountId, 
                                               @Param("symbol") String symbol,
                                               @Param("side") Trade.TradeSide side);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId AND t.symbol = :symbol AND t.side = :side")
    List<Trade> findByUserIdAndSymbolAndSide(@Param("userId") Long userId, 
                                            @Param("symbol") String symbol,
                                            @Param("side") Trade.TradeSide side);
    
    @Query("SELECT t FROM Trade t WHERE t.strategy.id = :strategyId AND t.symbol = :symbol AND t.side = :side")
    List<Trade> findByStrategyIdAndSymbolAndSide(@Param("strategyId") Long strategyId, 
                                                @Param("symbol") String symbol,
                                                @Param("side") Trade.TradeSide side);
}