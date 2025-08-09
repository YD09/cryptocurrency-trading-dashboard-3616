package com.tradecrafter.repository;

import com.tradecrafter.model.Trade;
import com.tradecrafter.model.TradeStatus;
import com.tradecrafter.model.TradeType;
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
    
    List<Trade> findByTradingAccountId(Long tradingAccountId);
    
    Page<Trade> findByTradingAccountId(Long tradingAccountId, Pageable pageable);
    
    List<Trade> findByTradingAccountIdAndStatus(Long tradingAccountId, TradeStatus status);
    
    List<Trade> findByTradingAccountIdAndSymbol(Long tradingAccountId, String symbol);
    
    List<Trade> findByTradingAccountIdAndSymbolAndStatus(
        Long tradingAccountId, String symbol, TradeStatus status
    );
    
    @Query("SELECT t FROM Trade t WHERE t.tradingAccount.id = :accountId AND " +
           "t.openTime BETWEEN :startDate AND :endDate")
    List<Trade> findByTradingAccountIdAndDateRange(
        @Param("accountId") Long accountId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT t FROM Trade t WHERE t.tradingAccount.id = :accountId AND " +
           "t.status = :status AND t.openTime BETWEEN :startDate AND :endDate")
    List<Trade> findByTradingAccountIdAndStatusAndDateRange(
        @Param("accountId") Long accountId,
        @Param("status") TradeStatus status,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.tradingAccount.id = :accountId AND t.status = :status")
    long countByTradingAccountIdAndStatus(
        @Param("accountId") Long accountId, 
        @Param("status") TradeStatus status
    );
    
    @Query("SELECT SUM(t.realizedPnl) FROM Trade t WHERE t.tradingAccount.id = :accountId AND " +
           "t.status = 'CLOSED' AND t.realizedPnl IS NOT NULL")
    BigDecimal sumRealizedPnlByTradingAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT AVG(t.realizedPnl) FROM Trade t WHERE t.tradingAccount.id = :accountId AND " +
           "t.status = 'CLOSED' AND t.realizedPnl > 0")
    BigDecimal avgWinningTradeByTradingAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT AVG(t.realizedPnl) FROM Trade t WHERE t.tradingAccount.id = :accountId AND " +
           "t.status = 'CLOSED' AND t.realizedPnl < 0")
    BigDecimal avgLosingTradeByTradingAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.tradingAccount.id = :accountId AND " +
           "t.status = 'CLOSED' AND t.realizedPnl > 0")
    long countWinningTradesByTradingAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.tradingAccount.id = :accountId AND " +
           "t.status = 'CLOSED' AND t.realizedPnl < 0")
    long countLosingTradesByTradingAccountId(@Param("accountId") Long accountId);
    
    List<Trade> findByPineScriptId(Long pineScriptId);
    
    @Query("SELECT t FROM Trade t WHERE t.tradingAccount.user.id = :userId")
    List<Trade> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trade t WHERE t.tradingAccount.user.id = :userId")
    Page<Trade> findByUserId(@Param("userId") Long userId, Pageable pageable);
}