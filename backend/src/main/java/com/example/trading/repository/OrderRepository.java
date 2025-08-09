package com.example.trading.repository;

import com.example.trading.domain.Order;
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
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByAccountId(Long accountId);
    
    Page<Order> findByAccountId(Long accountId, Pageable pageable);
    
    List<Order> findByUserId(Long userId);
    
    List<Order> findByAccountIdAndStatus(Long accountId, Order.OrderStatus status);
    
    List<Order> findByUserIdAndStatus(Long userId, Order.OrderStatus status);
    
    List<Order> findByAccountIdAndSymbol(Long accountId, String symbol);
    
    List<Order> findByUserIdAndSymbol(Long userId, String symbol);
    
    List<Order> findByAccountIdAndType(Long accountId, Order.OrderType type);
    
    List<Order> findByAccountIdAndSide(Long accountId, Order.OrderSide side);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.symbol = :symbol AND o.status = :status")
    List<Order> findByAccountIdAndSymbolAndStatus(@Param("accountId") Long accountId, 
                                                 @Param("symbol") String symbol,
                                                 @Param("status") Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.createdAt >= :since")
    List<Order> findByAccountIdAndCreatedSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.createdAt >= :since")
    List<Order> findByUserIdAndCreatedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.price >= :minPrice")
    List<Order> findByAccountIdAndMinPrice(@Param("accountId") Long accountId, @Param("minPrice") BigDecimal minPrice);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.price <= :maxPrice")
    List<Order> findByAccountIdAndMaxPrice(@Param("accountId") Long accountId, @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.volume >= :minVolume")
    List<Order> findByAccountIdAndMinVolume(@Param("accountId") Long accountId, @Param("minVolume") BigDecimal minVolume);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.filledAt >= :since")
    List<Order> findByAccountIdAndFilledSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.expiresAt <= :expiryTime")
    List<Order> findExpiredOrders(@Param("accountId") Long accountId, @Param("expiryTime") LocalDateTime expiryTime);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId ORDER BY o.createdAt DESC")
    List<Order> findByAccountIdOrderByCreatedAtDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId ORDER BY o.filledAt DESC")
    List<Order> findByAccountIdOrderByFilledAtDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.status IN ('PENDING', 'PARTIALLY_FILLED')")
    List<Order> findActiveOrdersByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status IN ('PENDING', 'PARTIALLY_FILLED')")
    List<Order> findActiveOrdersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.account.id = :accountId")
    long countByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.account.id = :accountId AND o.status = :status")
    long countByAccountIdAndStatus(@Param("accountId") Long accountId, @Param("status") Order.OrderStatus status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.symbol = :symbol AND o.side = :side AND o.status IN ('PENDING', 'PARTIALLY_FILLED')")
    List<Order> findActiveOrdersByAccountAndSymbolAndSide(@Param("accountId") Long accountId, 
                                                         @Param("symbol") String symbol,
                                                         @Param("side") Order.OrderSide side);
}