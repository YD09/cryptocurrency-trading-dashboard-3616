package com.tradecrafter.repository;

import com.tradecrafter.model.TradingAccount;
import com.tradecrafter.model.AccountStatus;
import com.tradecrafter.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TradingAccountRepository extends JpaRepository<TradingAccount, Long> {
    
    List<TradingAccount> findByUserId(Long userId);
    
    List<TradingAccount> findByUserIdAndStatus(Long userId, AccountStatus status);
    
    List<TradingAccount> findByUserIdAndAccountType(Long userId, AccountType accountType);
    
    List<TradingAccount> findByTeamId(Long teamId);
    
    List<TradingAccount> findByTeamIdAndStatus(Long teamId, AccountStatus status);
    
    List<TradingAccount> findByIsSharedTrue();
    
    @Query("SELECT ta FROM TradingAccount ta WHERE " +
           "(ta.user.id = :userId OR ta.team.id IN " +
           "(SELECT t.id FROM Team t JOIN t.members m WHERE m.id = :userId)) " +
           "AND ta.status = :status")
    List<TradingAccount> findAccessibleByUserIdAndStatus(
        @Param("userId") Long userId, 
        @Param("status") AccountStatus status
    );
    
    @Query("SELECT ta FROM TradingAccount ta WHERE " +
           "ta.user.id = :userId OR ta.team.id IN " +
           "(SELECT t.id FROM Team t JOIN t.members m WHERE m.id = :userId)")
    List<TradingAccount> findAccessibleByUserId(@Param("userId") Long userId);
    
    Optional<TradingAccount> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT ta FROM TradingAccount ta WHERE ta.id = :id AND " +
           "(ta.user.id = :userId OR ta.team.id IN " +
           "(SELECT t.id FROM Team t JOIN t.members m WHERE m.id = :userId))")
    Optional<TradingAccount> findByIdAndAccessibleByUserId(
        @Param("id") Long id, 
        @Param("userId") Long userId
    );
    
    @Query("SELECT COUNT(ta) FROM TradingAccount ta WHERE ta.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}