package com.example.trading.repository;

import com.example.trading.domain.AlertTrigger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertTriggerRepository extends JpaRepository<AlertTrigger, Long> {
    
    List<AlertTrigger> findByAlertId(Long alertId);
    
    Page<AlertTrigger> findByAlertId(Long alertId, Pageable pageable);
    
    List<AlertTrigger> findByUserId(Long userId);
    
    List<AlertTrigger> findByAlertIdAndStatus(Long alertId, AlertTrigger.TriggerStatus status);
    
    List<AlertTrigger> findByUserIdAndStatus(Long userId, AlertTrigger.TriggerStatus status);
    
    List<AlertTrigger> findByAlertIdAndDeliveryMethod(Long alertId, AlertTrigger.DeliveryMethod deliveryMethod);
    
    List<AlertTrigger> findByUserIdAndDeliveryMethod(Long userId, AlertTrigger.DeliveryMethod deliveryMethod);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.status = 'PENDING'")
    List<AlertTrigger> findPendingByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.status = 'PENDING'")
    List<AlertTrigger> findPendingByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.status = 'DELIVERED'")
    List<AlertTrigger> findDeliveredByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.status = 'DELIVERED'")
    List<AlertTrigger> findDeliveredByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.status = 'FAILED'")
    List<AlertTrigger> findFailedByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.status = 'FAILED'")
    List<AlertTrigger> findFailedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.triggeredAt >= :since")
    List<AlertTrigger> findByAlertIdAndTriggeredSince(@Param("alertId") Long alertId, @Param("since") LocalDateTime since);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.triggeredAt >= :since")
    List<AlertTrigger> findByUserIdAndTriggeredSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.deliveredAt >= :since")
    List<AlertTrigger> findByAlertIdAndDeliveredSince(@Param("alertId") Long alertId, @Param("since") LocalDateTime since);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.deliveredAt >= :since")
    List<AlertTrigger> findByUserIdAndDeliveredSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId ORDER BY at.triggeredAt DESC")
    List<AlertTrigger> findByAlertIdOrderByTriggeredAtDesc(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId ORDER BY at.triggeredAt DESC")
    List<AlertTrigger> findByUserIdOrderByTriggeredAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId ORDER BY at.deliveredAt DESC")
    List<AlertTrigger> findByAlertIdOrderByDeliveredAtDesc(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId ORDER BY at.deliveredAt DESC")
    List<AlertTrigger> findByUserIdOrderByDeliveredAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.alert.id = :alertId")
    long countByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.status = :status")
    long countByAlertIdAndStatus(@Param("alertId") Long alertId, @Param("status") AlertTrigger.TriggerStatus status);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.user.id = :userId AND at.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") AlertTrigger.TriggerStatus status);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.status = 'PENDING'")
    long countPendingByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.user.id = :userId AND at.status = 'PENDING'")
    long countPendingByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.status = 'DELIVERED'")
    long countDeliveredByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.user.id = :userId AND at.status = 'DELIVERED'")
    long countDeliveredByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.status = 'FAILED'")
    long countFailedByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT COUNT(at) FROM AlertTrigger at WHERE at.user.id = :userId AND at.status = 'FAILED'")
    long countFailedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.deliveryMethod = 'EMAIL'")
    List<AlertTrigger> findEmailTriggersByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.deliveryMethod = 'EMAIL'")
    List<AlertTrigger> findEmailTriggersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.deliveryMethod = 'WEB_NOTIFICATION'")
    List<AlertTrigger> findWebNotificationTriggersByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.deliveryMethod = 'WEB_NOTIFICATION'")
    List<AlertTrigger> findWebNotificationTriggersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.deliveryMethod = 'WEBHOOK'")
    List<AlertTrigger> findWebhookTriggersByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.deliveryMethod = 'WEBHOOK'")
    List<AlertTrigger> findWebhookTriggersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.deliveryResponse IS NOT NULL")
    List<AlertTrigger> findWithDeliveryResponseByAlertId(@Param("alertId") Long alertId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.deliveryResponse IS NOT NULL")
    List<AlertTrigger> findWithDeliveryResponseByUserId(@Param("userId") Long userId);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.alert.id = :alertId AND at.deliveryResponse LIKE %:error%")
    List<AlertTrigger> findWithErrorByAlertId(@Param("alertId") Long alertId, @Param("error") String error);
    
    @Query("SELECT at FROM AlertTrigger at WHERE at.user.id = :userId AND at.deliveryResponse LIKE %:error%")
    List<AlertTrigger> findWithErrorByUserId(@Param("userId") Long userId, @Param("error") String error);
}