package com.example.trading.repository;

import com.example.trading.domain.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    
    List<TeamMember> findByUserId(Long userId);
    
    List<TeamMember> findByAccountId(Long accountId);
    
    Optional<TeamMember> findByUserIdAndAccountId(Long userId, Long accountId);
    
    List<TeamMember> findByUserIdAndRole(Long userId, TeamMember.TeamRole role);
    
    List<TeamMember> findByAccountIdAndRole(Long accountId, TeamMember.TeamRole role);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId AND tm.role = 'OWNER'")
    List<TeamMember> findOwnedAccountsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId AND tm.role = 'TRADER'")
    List<TeamMember> findTradingAccountsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId AND tm.role = 'VIEWER'")
    List<TeamMember> findViewerAccountsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.role = 'OWNER'")
    List<TeamMember> findOwnersByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.role = 'TRADER'")
    List<TeamMember> findTradersByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.role = 'VIEWER'")
    List<TeamMember> findViewersByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId AND tm.lastActivity >= :since")
    List<TeamMember> findByUserIdAndActiveSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.lastActivity >= :since")
    List<TeamMember> findByAccountIdAndActiveSince(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId ORDER BY tm.joinedAt DESC")
    List<TeamMember> findByUserIdOrderByJoinedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.account.id = :accountId ORDER BY tm.joinedAt DESC")
    List<TeamMember> findByAccountIdOrderByJoinedAtDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId ORDER BY tm.lastActivity DESC")
    List<TeamMember> findByUserIdOrderByLastActivityDesc(@Param("userId") Long userId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.account.id = :accountId ORDER BY tm.lastActivity DESC")
    List<TeamMember> findByAccountIdOrderByLastActivityDesc(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.account.id = :accountId")
    long countByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.user.id = :userId AND tm.role = :role")
    long countByUserIdAndRole(@Param("userId") Long userId, @Param("role") TeamMember.TeamRole role);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.role = :role")
    long countByAccountIdAndRole(@Param("accountId") Long accountId, @Param("role") TeamMember.TeamRole role);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.user.id = :userId AND tm.role = 'OWNER'")
    long countOwnedAccountsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.user.id = :userId AND tm.role = 'TRADER'")
    long countTradingAccountsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.user.id = :userId AND tm.role = 'VIEWER'")
    long countViewerAccountsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.role = 'OWNER'")
    long countOwnersByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.role = 'TRADER'")
    long countTradersByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.role = 'VIEWER'")
    long countViewersByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId AND tm.lastActivity < :since")
    List<TeamMember> findInactiveByUserId(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT tm FROM TeamMember tm WHERE tm.account.id = :accountId AND tm.lastActivity < :since")
    List<TeamMember> findInactiveByAccountId(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    boolean existsByUserIdAndAccountId(Long userId, Long accountId);
    
    @Query("SELECT EXISTS(SELECT 1 FROM TeamMember tm WHERE tm.user.id = :userId AND tm.account.id = :accountId AND tm.role = 'OWNER')")
    boolean isOwner(@Param("userId") Long userId, @Param("accountId") Long accountId);
    
    @Query("SELECT EXISTS(SELECT 1 FROM TeamMember tm WHERE tm.user.id = :userId AND tm.account.id = :accountId AND tm.role = 'TRADER')")
    boolean isTrader(@Param("userId") Long userId, @Param("accountId") Long accountId);
    
    @Query("SELECT EXISTS(SELECT 1 FROM TeamMember tm WHERE tm.user.id = :userId AND tm.account.id = :accountId AND tm.role = 'VIEWER')")
    boolean isViewer(@Param("userId") Long userId, @Param("accountId") Long accountId);
    
    @Query("SELECT EXISTS(SELECT 1 FROM TeamMember tm WHERE tm.user.id = :userId AND tm.account.id = :accountId AND (tm.role = 'OWNER' OR tm.role = 'TRADER'))")
    boolean canTrade(@Param("userId") Long userId, @Param("accountId") Long accountId);
    
    @Query("SELECT EXISTS(SELECT 1 FROM TeamMember tm WHERE tm.user.id = :userId AND tm.account.id = :accountId)")
    boolean isMember(@Param("userId") Long userId, @Param("accountId") Long accountId);
}