package com.tradecrafter.repository;

import com.tradecrafter.model.Order;
import com.tradecrafter.model.OrderStatus;
import com.tradecrafter.model.OrderType;
import com.tradecrafter.model.OrderSide;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByTradingAccountId(Long tradingAccountId);
    
    Page<Order> findByTradingAccountId(Long tradingAccountId, Pageable pageable);
    
    List<Order> findByTradingAccountIdAndStatus(Long tradingAccountId, OrderStatus status);
    
    List<Order> findByTradingAccountIdAndSymbol(Long tradingAccountId, String symbol);
    
    List<Order> findByTradingAccountIdAndSymbolAndStatus(
        Long tradingAccountId, String symbol, OrderStatus status
    );
    
    @Query("SELECT o FROM Order o WHERE o.tradingAccount.id = :accountId AND " +
           "o.status IN ('PENDING', 'PARTIAL_FILLED')")
    List<Order> findActiveOrdersByTradingAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT o FROM Order o WHERE o.tradingAccount.id = :accountId AND " +
           "o.symbol = :symbol AND o.status IN ('PENDING', 'PARTIAL_FILLED')")
    List<Order> findActiveOrdersByTradingAccountIdAndSymbol(
        @Param("accountId") Long accountId, 
        @Param("symbol") String symbol
    );
    
    @Query("SELECT o FROM Order o WHERE o.tradingAccount.id = :accountId AND " +
           "o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByTradingAccountIdAndDateRange(
        @Param("accountId") Long accountId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND " +
           "o.expiredAt IS NOT NULL AND o.expiredAt <= :currentTime")
    List<Order> findExpiredOrders(
        @Param("status") OrderStatus status,
        @Param("currentTime") LocalDateTime currentTime
    );
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.tradingAccount.id = :accountId AND o.status = :status")
    long countByTradingAccountIdAndStatus(
        @Param("accountId") Long accountId, 
        @Param("status") OrderStatus status
    );
    
    List<Order> findByPineScriptId(Long pineScriptId);
    
    @Query("SELECT o FROM Order o WHERE o.tradingAccount.user.id = :userId")
    List<Order> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.tradingAccount.user.id = :userId")
    Page<Order> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.orderType = :orderType AND o.symbol = :symbol AND " +
           "o.status IN ('PENDING', 'PARTIAL_FILLED') ORDER BY o.price ASC")
    List<Order> findBuyOrdersOrderByPrice(
        @Param("orderType") OrderType orderType, 
        @Param("symbol") String symbol
    );
    
    @Query("SELECT o FROM Order o WHERE o.orderType = :orderType AND o.symbol = :symbol AND " +
           "o.status IN ('PENDING', 'PARTIAL_FILLED') ORDER BY o.price DESC")
    List<Order> findSellOrdersOrderByPrice(
        @Param("orderType") OrderType orderType, 
        @Param("symbol") String symbol
    );
}