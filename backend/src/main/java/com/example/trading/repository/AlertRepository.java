package com.example.trading.repository;

import com.example.trading.domain.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    
    List<Alert> findByUserId(Long userId);
    
    Page<Alert> findByUserId(Long userId, Pageable pageable);
    
    List<Alert> findByStrategyId(Long strategyId);
    
    List<Alert> findByUserIdAndStatus(Long userId, Alert.AlertStatus status);
    
    List<Alert> findByStrategyIdAndStatus(Long strategyId, Alert.AlertStatus status);
    
    List<Alert> findByUserIdAndType(Long userId, Alert.AlertType type);
    
    List<Alert> findByStrategyIdAndType(Long strategyId, Alert.AlertType type);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.status = 'ACTIVE'")
    List<Alert> findActiveByUserId(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId AND a.status = 'ACTIVE'")
    List<Alert> findActiveByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.lastTriggered >= :since")
    List<Alert> findByUserIdAndTriggeredSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId AND a.lastTriggered >= :since")
    List<Alert> findByStrategyIdAndTriggeredSince(@Param("strategyId") Long strategyId, @Param("since") LocalDateTime since);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.triggerCount >= :minTriggers")
    List<Alert> findByUserIdAndMinTriggers(@Param("userId") Long userId, @Param("minTriggers") Integer minTriggers);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId AND a.triggerCount >= :minTriggers")
    List<Alert> findByStrategyIdAndMinTriggers(@Param("strategyId") Long strategyId, @Param("minTriggers") Integer minTriggers);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.name LIKE %:name%")
    List<Alert> findByUserIdAndNameContaining(@Param("userId") Long userId, @Param("name") String name);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId AND a.name LIKE %:name%")
    List<Alert> findByStrategyIdAndNameContaining(@Param("strategyId") Long strategyId, @Param("name") String name);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.emailAddress = :emailAddress")
    List<Alert> findByUserIdAndEmailAddress(@Param("userId") Long userId, @Param("emailAddress") String emailAddress);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.webhookUrl IS NOT NULL")
    List<Alert> findByUserIdWithWebhook(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND 'EMAIL' MEMBER OF a.deliveryMethods")
    List<Alert> findByUserIdWithEmailDelivery(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND 'WEB_NOTIFICATION' MEMBER OF a.deliveryMethods")
    List<Alert> findByUserIdWithWebNotificationDelivery(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND 'WEBHOOK' MEMBER OF a.deliveryMethods")
    List<Alert> findByUserIdWithWebhookDelivery(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId ORDER BY a.createdAt DESC")
    List<Alert> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId ORDER BY a.createdAt DESC")
    List<Alert> findByStrategyIdOrderByCreatedAtDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId ORDER BY a.lastTriggered DESC")
    List<Alert> findByUserIdOrderByLastTriggeredDesc(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId ORDER BY a.lastTriggered DESC")
    List<Alert> findByStrategyIdOrderByLastTriggeredDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId ORDER BY a.triggerCount DESC")
    List<Alert> findByUserIdOrderByTriggerCountDesc(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId ORDER BY a.triggerCount DESC")
    List<Alert> findByStrategyIdOrderByTriggerCountDesc(@Param("strategyId") Long strategyId);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.strategy.id = :strategyId")
    long countByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user.id = :userId AND a.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Alert.AlertStatus status);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.strategy.id = :strategyId AND a.status = :status")
    long countByStrategyIdAndStatus(@Param("strategyId") Long strategyId, @Param("status") Alert.AlertStatus status);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user.id = :userId AND a.status = 'ACTIVE'")
    long countActiveByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.strategy.id = :strategyId AND a.status = 'ACTIVE'")
    long countActiveByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.triggerCount > 0")
    List<Alert> findTriggeredByUserId(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId AND a.triggerCount > 0")
    List<Alert> findTriggeredByStrategyId(@Param("strategyId") Long strategyId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.triggerCount = 0")
    List<Alert> findNeverTriggeredByUserId(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.strategy.id = :strategyId AND a.triggerCount = 0")
    List<Alert> findNeverTriggeredByStrategyId(@Param("strategyId") Long strategyId);
}