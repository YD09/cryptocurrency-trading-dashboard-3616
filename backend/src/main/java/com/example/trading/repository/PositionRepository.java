package com.example.trading.repository;

import com.example.trading.domain.Position;
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
public interface PositionRepository extends JpaRepository<Position, Long> {
    
    List<Position> findByAccountId(Long accountId);
    
    Page<Position> findByAccountId(Long accountId, Pageable pageable);
    
    List<Position> findByUserId(Long userId);
    
    List<Position> findByAccountIdAndStatus(Long accountId, Position.PositionStatus status);
    
    List<Position> findByUserIdAndStatus(Long userId, Position.PositionStatus status);
    
    List<Position> findByAccountIdAndSymbol(Long accountId, String symbol);
    
    List<Position> findByUserIdAndSymbol(Long userId, String symbol);
    
    List<Position> findByAccountIdAndSide(Long accountId, Position.PositionSide side);
    
    List<Position> findByUserIdAndSide(Long userId, Position.PositionSide side);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.status = 'OPEN'")
    List<Position> findOpenByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.status = 'OPEN'")
    List<Position> findOpenByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.status = 'CLOSED'")
    List<Position> findClosedByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.status = 'CLOSED'")
    List<Position> findClosedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.unrealizedPnL > 0")
    List<Position> findProfitableByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.unrealizedPnL > 0")
    List<Position> findProfitableByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.unrealizedPnL < 0")
    List<Position> findLosingByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.unrealizedPnL < 0")
    List<Position> findLosingByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.openedAt >= :since")
    List<Position> findByAccountIdAndOpenedSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.openedAt >= :since")
    List<Position> findByUserIdAndOpenedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.closedAt >= :since")
    List<Position> findByAccountIdAndClosedSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.closedAt >= :since")
    List<Position> findByUserIdAndClosedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.volume >= :minVolume")
    List<Position> findByAccountIdAndMinVolume(@Param("accountId") Long accountId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.volume >= :minVolume")
    List<Position> findByUserIdAndMinVolume(@Param("userId") Long userId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId ORDER BY p.openedAt DESC")
    List<Position> findByAccountIdOrderByOpenedAtDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId ORDER BY p.openedAt DESC")
    List<Position> findByUserIdOrderByOpenedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId ORDER BY p.unrealizedPnL DESC")
    List<Position> findByAccountIdOrderByUnrealizedPnLDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId ORDER BY p.unrealizedPnL DESC")
    List<Position> findByUserIdOrderByUnrealizedPnLDesc(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId ORDER BY p.volume DESC")
    List<Position> findByAccountIdOrderByVolumeDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId ORDER BY p.volume DESC")
    List<Position> findByUserIdOrderByVolumeDesc(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM Position p WHERE p.account.id = :accountId")
    long countByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(p) FROM Position p WHERE p.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM Position p WHERE p.account.id = :accountId AND p.status = :status")
    long countByAccountIdAndStatus(@Param("accountId") Long accountId, @Param("status") Position.PositionStatus status);
    
    @Query("SELECT COUNT(p) FROM Position p WHERE p.user.id = :userId AND p.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Position.PositionStatus status);
    
    @Query("SELECT COUNT(p) FROM Position p WHERE p.account.id = :accountId AND p.status = 'OPEN'")
    long countOpenByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(p) FROM Position p WHERE p.user.id = :userId AND p.status = 'OPEN'")
    long countOpenByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.symbol = :symbol AND p.status = 'OPEN'")
    List<Position> findOpenByAccountIdAndSymbol(@Param("accountId") Long accountId, @Param("symbol") String symbol);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.symbol = :symbol AND p.status = 'OPEN'")
    List<Position> findOpenByUserIdAndSymbol(@Param("userId") Long userId, @Param("symbol") String symbol);
    
    @Query("SELECT p FROM Position p WHERE p.account.id = :accountId AND p.symbol = :symbol AND p.side = :side AND p.status = 'OPEN'")
    List<Position> findOpenByAccountIdAndSymbolAndSide(@Param("accountId") Long accountId, 
                                                      @Param("symbol") String symbol,
                                                      @Param("side") Position.PositionSide side);
    
    @Query("SELECT p FROM Position p WHERE p.user.id = :userId AND p.symbol = :symbol AND p.side = :side AND p.status = 'OPEN'")
    List<Position> findOpenByUserIdAndSymbolAndSide(@Param("userId") Long userId, 
                                                   @Param("symbol") String symbol,
                                                   @Param("side") Position.PositionSide side);
}