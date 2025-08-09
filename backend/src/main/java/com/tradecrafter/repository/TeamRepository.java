package com.tradecrafter.repository;

import com.tradecrafter.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    List<Team> findByOwnerId(Long ownerId);
    
    List<Team> findByOwnerIdAndIsActiveTrue(Long ownerId);
    
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.id = :userId")
    List<Team> findByMemberId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.id = :userId AND t.isActive = true")
    List<Team> findActiveTeamsByMemberId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Team t WHERE t.owner.id = :ownerId OR " +
           "t.id IN (SELECT tm.id FROM Team tm JOIN tm.members m WHERE m.id = :ownerId)")
    List<Team> findByOwnerIdOrMemberId(@Param("ownerId") Long ownerId);
    
    @Query("SELECT t FROM Team t WHERE (t.owner.id = :userId OR " +
           "t.id IN (SELECT tm.id FROM Team tm JOIN tm.members m WHERE m.id = :userId)) " +
           "AND t.isActive = true")
    List<Team> findActiveTeamsByOwnerIdOrMemberId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Team t WHERE t.id = :teamId AND " +
           "(t.owner.id = :userId OR t.id IN (SELECT tm.id FROM Team tm JOIN tm.members m WHERE m.id = :userId))")
    Optional<Team> findByIdAndAccessibleByUserId(@Param("teamId") Long teamId, @Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Team t WHERE t.owner.id = :ownerId")
    long countByOwnerId(@Param("ownerId") Long ownerId);
    
    @Query("SELECT COUNT(DISTINCT t) FROM Team t JOIN t.members m WHERE m.id = :userId")
    long countTeamsByMemberId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Team t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "AND t.isActive = true")
    List<Team> searchByName(@Param("searchTerm") String searchTerm);
    
    boolean existsByName(String name);
    
    @Query("SELECT CASE WHEN COUNT(tm) > 0 THEN true ELSE false END FROM Team t " +
           "JOIN t.members tm WHERE t.id = :teamId AND tm.id = :userId")
    boolean isUserMemberOfTeam(@Param("teamId") Long teamId, @Param("userId") Long userId);
}