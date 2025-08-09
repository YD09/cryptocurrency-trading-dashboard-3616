package com.example.trading.repository;

import com.example.trading.domain.PaperTradingExecution;
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
public interface PaperTradingExecutionRepository extends JpaRepository<PaperTradingExecution, Long> {
    
    List<PaperTradingExecution> findByStrategyId(Long strategyId);
    
    Page<PaperTradingExecution> findByStrategyId(Long strategyId, Pageable pageable);
    
    List<PaperTradingExecution> findByAccountId(Long accountId);
    
    List<PaperTradingExecution> findByUserId(Long userId);
    
    List<PaperTradingExecution> findByStrategyIdAndStatus(Long strategyId, PaperTradingExecution.ExecutionStatus status);
    
    List<PaperTradingExecution> findByAccountIdAndStatus(Long accountId, PaperTradingExecution.ExecutionStatus status);
    
    List<PaperTradingExecution> findByUserIdAndStatus(Long userId, PaperTradingExecution.ExecutionStatus status);
    
    List<PaperTradingExecution> findByStrategyIdAndSymbol(Long strategyId, String symbol);
    
    List<PaperTradingExecution> findByAccountIdAndSymbol(Long accountId, String symbol);
    
    List<PaperTradingExecution> findByUserIdAndSymbol(Long userId, String symbol);
    
    List<PaperTradingExecution> findByStrategyIdAndSignal(Long strategyId, PaperTradingExecution.ExecutionSignal signal);
    
    List<PaperTradingExecution> findByAccountIdAndSignal(Long accountId, PaperTradingExecution.ExecutionSignal signal);
    
    List<PaperTradingExecution> findByUserIdAndSignal(Long userId, PaperTradingExecution.ExecutionSignal signal);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.status = 'PENDING'")
    List<PaperTradingExecution> findPendingByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.status = 'PENDING'")
    List<PaperTradingExecution> findPendingByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.status = 'PENDING'")
    List<PaperTradingExecution> findPendingByUserId(@Param("userId") Long userId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.status = 'EXECUTED'")
    List<PaperTradingExecution> findExecutedByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.status = 'EXECUTED'")
    List<PaperTradingExecution> findExecutedByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.status = 'EXECUTED'")
    List<PaperTradingExecution> findExecutedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.status = 'FAILED'")
    List<PaperTradingExecution> findFailedByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.status = 'FAILED'")
    List<PaperTradingExecution> findFailedByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.status = 'FAILED'")
    List<PaperTradingExecution> findFailedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.signal IN ('BUY', 'BUY_LONG')")
    List<PaperTradingExecution> findBuySignalsByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.signal IN ('BUY', 'BUY_LONG')")
    List<PaperTradingExecution> findBuySignalsByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.signal IN ('BUY', 'BUY_LONG')")
    List<PaperTradingExecution> findBuySignalsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.signal IN ('SELL', 'SELL_SHORT')")
    List<PaperTradingExecution> findSellSignalsByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.signal IN ('SELL', 'SELL_SHORT')")
    List<PaperTradingExecution> findSellSignalsByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.signal IN ('SELL', 'SELL_SHORT')")
    List<PaperTradingExecution> findSellSignalsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.signal IN ('EXIT_LONG', 'EXIT_SHORT')")
    List<PaperTradingExecution> findExitSignalsByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.signal IN ('EXIT_LONG', 'EXIT_SHORT')")
    List<PaperTradingExecution> findExitSignalsByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.signal IN ('EXIT_LONG', 'EXIT_SHORT')")
    List<PaperTradingExecution> findExitSignalsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.createdAt >= :since")
    List<PaperTradingExecution> findByStrategyIdAndCreatedSince(@Param("strategyId") Long strategyId, @Param("since") LocalDateTime since);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.createdAt >= :since")
    List<PaperTradingExecution> findByAccountIdAndCreatedSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.createdAt >= :since")
    List<PaperTradingExecution> findByUserIdAndCreatedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.executedAt >= :since")
    List<PaperTradingExecution> findByStrategyIdAndExecutedSince(@Param("strategyId") Long strategyId, @Param("since") LocalDateTime since);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.executedAt >= :since")
    List<PaperTradingExecution> findByAccountIdAndExecutedSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.executedAt >= :since")
    List<PaperTradingExecution> findByUserIdAndExecutedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.volume >= :minVolume")
    List<PaperTradingExecution> findByStrategyIdAndMinVolume(@Param("strategyId") Long strategyId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.volume >= :minVolume")
    List<PaperTradingExecution> findByAccountIdAndMinVolume(@Param("accountId") Long accountId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.volume >= :minVolume")
    List<PaperTradingExecution> findByUserIdAndMinVolume(@Param("userId") Long userId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId ORDER BY pe.createdAt DESC")
    List<PaperTradingExecution> findByStrategyIdOrderByCreatedAtDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId ORDER BY pe.createdAt DESC")
    List<PaperTradingExecution> findByAccountIdOrderByCreatedAtDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId ORDER BY pe.createdAt DESC")
    List<PaperTradingExecution> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId ORDER BY pe.executedAt DESC")
    List<PaperTradingExecution> findByStrategyIdOrderByExecutedAtDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.account.id = :accountId ORDER BY pe.executedAt DESC")
    List<PaperTradingExecution> findByAccountIdOrderByExecutedAtDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT pe FROM PaperTradingExecution pe WHERE pe.user.id = :userId ORDER BY pe.executedAt DESC")
    List<PaperTradingExecution> findByUserIdOrderByExecutedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId")
    long countByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.account.id = :accountId")
    long countByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.status = :status")
    long countByStrategyIdAndStatus(@Param("strategyId") Long strategyId, @Param("status") PaperTradingExecution.ExecutionStatus status);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.status = :status")
    long countByAccountIdAndStatus(@Param("accountId") Long accountId, @Param("status") PaperTradingExecution.ExecutionStatus status);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") PaperTradingExecution.ExecutionStatus status);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.strategy.id = :strategyId AND pe.signal = :signal")
    long countByStrategyIdAndSignal(@Param("strategyId") Long strategyId, @Param("signal") PaperTradingExecution.ExecutionSignal signal);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.account.id = :accountId AND pe.signal = :signal")
    long countByAccountIdAndSignal(@Param("accountId") Long accountId, @Param("signal") PaperTradingExecution.ExecutionSignal signal);
    
    @Query("SELECT COUNT(pe) FROM PaperTradingExecution pe WHERE pe.user.id = :userId AND pe.signal = :signal")
    long countByUserIdAndSignal(@Param("userId") Long userId, @Param("signal") PaperTradingExecution.ExecutionSignal signal);
}