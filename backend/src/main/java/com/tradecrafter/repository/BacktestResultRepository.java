package com.tradecrafter.repository;

import com.tradecrafter.model.BacktestResult;
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
public interface BacktestResultRepository extends JpaRepository<BacktestResult, Long> {
    
    List<BacktestResult> findByUserId(Long userId);
    
    Page<BacktestResult> findByUserId(Long userId, Pageable pageable);
    
    List<BacktestResult> findByPineScriptId(Long pineScriptId);
    
    Page<BacktestResult> findByPineScriptId(Long pineScriptId, Pageable pageable);
    
    List<BacktestResult> findByUserIdAndPineScriptId(Long userId, Long pineScriptId);
    
    List<BacktestResult> findByUserIdAndSymbol(Long userId, String symbol);
    
    List<BacktestResult> findByPineScriptIdAndSymbol(Long pineScriptId, String symbol);
    
    @Query("SELECT br FROM BacktestResult br WHERE br.user.id = :userId AND " +
           "br.symbol = :symbol AND br.timeframe = :timeframe")
    List<BacktestResult> findByUserIdAndSymbolAndTimeframe(
        @Param("userId") Long userId,
        @Param("symbol") String symbol,
        @Param("timeframe") String timeframe
    );
    
    @Query("SELECT br FROM BacktestResult br WHERE br.pineScript.id = :pineScriptId AND " +
           "br.symbol = :symbol AND br.timeframe = :timeframe " +
           "ORDER BY br.createdAt DESC")
    List<BacktestResult> findByPineScriptIdAndSymbolAndTimeframeOrderByCreatedAtDesc(
        @Param("pineScriptId") Long pineScriptId,
        @Param("symbol") String symbol,
        @Param("timeframe") String timeframe
    );
    
    @Query("SELECT br FROM BacktestResult br WHERE br.user.id = :userId AND " +
           "br.createdAt BETWEEN :startDate AND :endDate")
    List<BacktestResult> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT br FROM BacktestResult br WHERE br.user.id = :userId AND " +
           "br.returnPercentage >= :minReturn ORDER BY br.returnPercentage DESC")
    List<BacktestResult> findByUserIdAndMinReturnOrderByReturnDesc(
        @Param("userId") Long userId,
        @Param("minReturn") BigDecimal minReturn
    );
    
    @Query("SELECT br FROM BacktestResult br WHERE br.user.id = :userId AND " +
           "br.maxDrawdownPercentage <= :maxDrawdown ORDER BY br.maxDrawdownPercentage ASC")
    List<BacktestResult> findByUserIdAndMaxDrawdownOrderByDrawdownAsc(
        @Param("userId") Long userId,
        @Param("maxDrawdown") BigDecimal maxDrawdown
    );
    
    @Query("SELECT br FROM BacktestResult br WHERE br.user.id = :userId AND " +
           "br.sharpeRatio >= :minSharpe ORDER BY br.sharpeRatio DESC")
    List<BacktestResult> findByUserIdAndMinSharpeOrderBySharpeDesc(
        @Param("userId") Long userId,
        @Param("minSharpe") BigDecimal minSharpe
    );
    
    @Query("SELECT COUNT(br) FROM BacktestResult br WHERE br.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(br) FROM BacktestResult br WHERE br.pineScript.id = :pineScriptId")
    long countByPineScriptId(@Param("pineScriptId") Long pineScriptId);
    
    @Query("SELECT AVG(br.returnPercentage) FROM BacktestResult br WHERE br.user.id = :userId")
    BigDecimal avgReturnByUserId(@Param("userId") Long userId);
    
    @Query("SELECT AVG(br.returnPercentage) FROM BacktestResult br WHERE br.pineScript.id = :pineScriptId")
    BigDecimal avgReturnByPineScriptId(@Param("pineScriptId") Long pineScriptId);
    
    @Query("SELECT MAX(br.returnPercentage) FROM BacktestResult br WHERE br.user.id = :userId")
    BigDecimal maxReturnByUserId(@Param("userId") Long userId);
    
    @Query("SELECT MIN(br.maxDrawdownPercentage) FROM BacktestResult br WHERE br.user.id = :userId")
    BigDecimal minDrawdownByUserId(@Param("userId") Long userId);
    
    @Query("SELECT br FROM BacktestResult br WHERE br.pineScript.id = :pineScriptId " +
           "ORDER BY br.createdAt DESC LIMIT 1")
    Optional<BacktestResult> findLatestByPineScriptId(@Param("pineScriptId") Long pineScriptId);
}