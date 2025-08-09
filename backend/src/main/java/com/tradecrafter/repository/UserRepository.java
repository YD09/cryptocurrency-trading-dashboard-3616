package com.tradecrafter.repository;

import com.tradecrafter.model.User;
import com.tradecrafter.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByActiveTrue();
    
    List<User> findByRole(UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.active = true AND u.role = :role")
    List<User> findActiveUsersByRole(@Param("role") UserRole role);
    
    @Query("SELECT u FROM User u JOIN u.teams t WHERE t.id = :teamId")
    List<User> findByTeamId(@Param("teamId") Long teamId);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countActiveUsers();
}