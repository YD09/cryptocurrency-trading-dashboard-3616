package com.tradecrafter.repository;

import com.tradecrafter.model.PineScript;
import com.tradecrafter.model.ScriptStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PineScriptRepository extends JpaRepository<PineScript, Long> {
    
    List<PineScript> findByUserId(Long userId);
    
    Page<PineScript> findByUserId(Long userId, Pageable pageable);
    
    List<PineScript> findByUserIdAndStatus(Long userId, ScriptStatus status);
    
    List<PineScript> findByIsPublicTrue();
    
    Page<PineScript> findByIsPublicTrue(Pageable pageable);
    
    @Query("SELECT p FROM PineScript p WHERE p.user.id = :userId OR p.isPublic = true")
    Page<PineScript> findByUserIdOrPublic(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT p FROM PineScript p WHERE " +
           "(p.user.id = :userId OR p.isPublic = true) AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<PineScript> searchByUserIdOrPublic(
        @Param("userId") Long userId, 
        @Param("searchTerm") String searchTerm, 
        Pageable pageable
    );
    
    @Query("SELECT COUNT(p) FROM PineScript p WHERE p.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM PineScript p WHERE p.user.id = :userId AND p.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ScriptStatus status);
    
    Optional<PineScript> findByIdAndUserId(Long id, Long userId);
}