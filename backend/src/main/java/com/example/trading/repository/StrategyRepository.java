package com.example.trading.repository;

import com.example.trading.domain.Strategy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StrategyRepository extends JpaRepository<Strategy, Long> {
    
    List<Strategy> findByUserId(Long userId);
    
    Page<Strategy> findByUserId(Long userId, Pageable pageable);
    
    List<Strategy> findByUserIdAndStatus(Long userId, Strategy.StrategyStatus status);
    
    List<Strategy> findByUserIdAndType(Long userId, Strategy.StrategyType type);
    
    List<Strategy> findByIsPublicTrue();
    
    Page<Strategy> findByIsPublicTrue(Pageable pageable);
    
    List<Strategy> findByStatus(Strategy.StrategyStatus status);
    
    List<Strategy> findByType(Strategy.StrategyType type);
    
    @Query("SELECT s FROM Strategy s WHERE s.user.id = :userId AND s.name LIKE %:name%")
    List<Strategy> findByUserIdAndNameContaining(@Param("userId") Long userId, @Param("name") String name);
    
    @Query("SELECT s FROM Strategy s WHERE s.isPublic = true AND s.name LIKE %:name%")
    List<Strategy> findPublicByNameContaining(@Param("name") String name);
    
    @Query("SELECT s FROM Strategy s WHERE s.user.id = :userId AND s.lastBacktestAt >= :since")
    List<Strategy> findByUserIdAndRecentlyBacktested(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT s FROM Strategy s WHERE s.user.id = :userId AND s.status = :status AND s.type = :type")
    List<Strategy> findByUserIdAndStatusAndType(@Param("userId") Long userId, 
                                               @Param("status") Strategy.StrategyStatus status,
                                               @Param("type") Strategy.StrategyType type);
    
    @Query("SELECT COUNT(s) FROM Strategy s WHERE s.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(s) FROM Strategy s WHERE s.user.id = :userId AND s.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Strategy.StrategyStatus status);
    
    @Query("SELECT s FROM Strategy s WHERE s.user.id = :userId ORDER BY s.lastBacktestAt DESC")
    List<Strategy> findByUserIdOrderByLastBacktestDesc(@Param("userId") Long userId);
    
    @Query("SELECT s FROM Strategy s WHERE s.user.id = :userId ORDER BY s.updatedAt DESC")
    List<Strategy> findByUserIdOrderByUpdatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT s FROM Strategy s WHERE s.isPublic = true ORDER BY s.createdAt DESC")
    List<Strategy> findPublicOrderByCreatedAtDesc();
    
    @Query("SELECT s FROM Strategy s WHERE s.user.id = :userId AND s.pineScript LIKE %:keyword%")
    List<Strategy> findByUserIdAndPineScriptContaining(@Param("userId") Long userId, @Param("keyword") String keyword);
}