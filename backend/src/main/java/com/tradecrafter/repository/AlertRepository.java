package com.tradecrafter.repository;

import com.tradecrafter.model.Alert;
import com.tradecrafter.model.AlertType;
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
    
    List<Alert> findByUserIdAndIsActiveTrue(Long userId);
    
    List<Alert> findByUserIdAndSymbol(Long userId, String symbol);
    
    List<Alert> findByUserIdAndSymbolAndIsActiveTrue(Long userId, String symbol);
    
    @Query("SELECT a FROM Alert a WHERE a.isActive = true AND a.isTriggered = false")
    List<Alert> findActiveUnTriggeredAlerts();
    
    @Query("SELECT a FROM Alert a WHERE a.isActive = true AND a.isTriggered = false AND a.symbol = :symbol")
    List<Alert> findActiveUnTriggeredAlertsBySymbol(@Param("symbol") String symbol);
    
    @Query("SELECT a FROM Alert a WHERE a.isActive = true AND " +
           "a.expiresAt IS NOT NULL AND a.expiresAt <= :currentTime")
    List<Alert> findExpiredAlerts(@Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT a FROM Alert a WHERE a.isActive = true AND " +
           "a.maxTriggers IS NOT NULL AND a.triggerCount >= a.maxTriggers")
    List<Alert> findMaxTriggeredAlerts();
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user.id = :userId AND a.isActive = true")
    long countActiveAlertsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user.id = :userId AND " +
           "a.isActive = true AND a.alertType = :alertType")
    long countActiveAlertsByUserIdAndType(
        @Param("userId") Long userId, 
        @Param("alertType") AlertType alertType
    );
    
    List<Alert> findByPineScriptId(Long pineScriptId);
    
    List<Alert> findByPineScriptIdAndIsActiveTrue(Long pineScriptId);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND " +
           "a.lastTriggered BETWEEN :startDate AND :endDate")
    List<Alert> findByUserIdAndTriggeredDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT a FROM Alert a WHERE a.emailEnabled = true AND a.isActive = true AND " +
           "a.isTriggered = false AND a.symbol = :symbol")
    List<Alert> findEmailEnabledAlertsBySymbol(@Param("symbol") String symbol);
    
    @Query("SELECT a FROM Alert a WHERE a.webEnabled = true AND a.isActive = true AND " +
           "a.isTriggered = false AND a.symbol = :symbol")
    List<Alert> findWebEnabledAlertsBySymbol(@Param("symbol") String symbol);
}