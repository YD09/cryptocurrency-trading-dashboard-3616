package com.example.trading.repository;

import com.example.trading.domain.PaperTradingAccount;
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
public interface PaperTradingAccountRepository extends JpaRepository<PaperTradingAccount, Long> {
    
    List<PaperTradingAccount> findByOwnerId(Long ownerId);
    
    Page<PaperTradingAccount> findByOwnerId(Long ownerId, Pageable pageable);
    
    List<PaperTradingAccount> findByOwnerIdAndStatus(Long ownerId, PaperTradingAccount.AccountStatus status);
    
    List<PaperTradingAccount> findByOwnerIdAndType(Long ownerId, PaperTradingAccount.AccountType type);
    
    @Query("SELECT a FROM PaperTradingAccount a JOIN a.teamMembers tm WHERE tm.user.id = :userId")
    List<PaperTradingAccount> findByTeamMemberId(@Param("userId") Long userId);
    
    @Query("SELECT a FROM PaperTradingAccount a JOIN a.teamMembers tm WHERE tm.user.id = :userId AND a.status = :status")
    List<PaperTradingAccount> findByTeamMemberIdAndStatus(@Param("userId") Long userId, 
                                                         @Param("status") PaperTradingAccount.AccountStatus status);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId OR EXISTS (SELECT tm FROM a.teamMembers tm WHERE tm.user.id = :userId)")
    List<PaperTradingAccount> findByUserIdOrTeamMember(@Param("userId") Long userId);
    
    List<PaperTradingAccount> findByStatus(PaperTradingAccount.AccountStatus status);
    
    List<PaperTradingAccount> findByType(PaperTradingAccount.AccountType type);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.balance >= :minBalance")
    List<PaperTradingAccount> findByMinBalance(@Param("minBalance") BigDecimal minBalance);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.equity >= :minEquity")
    List<PaperTradingAccount> findByMinEquity(@Param("minEquity") BigDecimal minEquity);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.marginLevel <= :maxMarginLevel")
    List<PaperTradingAccount> findByMaxMarginLevel(@Param("maxMarginLevel") BigDecimal maxMarginLevel);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.lastActivity >= :since")
    List<PaperTradingAccount> findActiveSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId AND a.name LIKE %:name%")
    List<PaperTradingAccount> findByOwnerIdAndNameContaining(@Param("userId") Long userId, @Param("name") String name);
    
    @Query("SELECT COUNT(a) FROM PaperTradingAccount a WHERE a.owner.id = :userId")
    long countByOwnerId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(a) FROM PaperTradingAccount a WHERE a.owner.id = :userId AND a.status = :status")
    long countByOwnerIdAndStatus(@Param("userId") Long userId, @Param("status") PaperTradingAccount.AccountStatus status);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId ORDER BY a.lastActivity DESC")
    List<PaperTradingAccount> findByOwnerIdOrderByLastActivityDesc(@Param("userId") Long userId);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId ORDER BY a.createdAt DESC")
    List<PaperTradingAccount> findByOwnerIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId ORDER BY a.equity DESC")
    List<PaperTradingAccount> findByOwnerIdOrderByEquityDesc(@Param("userId") Long userId);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId ORDER BY a.balance DESC")
    List<PaperTradingAccount> findByOwnerIdOrderByBalanceDesc(@Param("userId") Long userId);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId AND a.equity > a.balance")
    List<PaperTradingAccount> findProfitableByOwnerId(@Param("userId") Long userId);
    
    @Query("SELECT a FROM PaperTradingAccount a WHERE a.owner.id = :userId AND a.equity < a.balance")
    List<PaperTradingAccount> findLosingByOwnerId(@Param("userId") Long userId);
}