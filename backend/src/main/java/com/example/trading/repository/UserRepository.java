package com.example.trading.repository;

import com.example.trading.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.enabled = :enabled")
    List<User> findByEnabled(@Param("enabled") boolean enabled);
    
    @Query("SELECT u FROM User u WHERE u.emailVerified = :verified")
    List<User> findByEmailVerified(@Param("verified") boolean verified);
    
    @Query("SELECT u FROM User u WHERE u.lastLogin >= :since")
    List<User> findActiveUsersSince(@Param("since") java.time.LocalDateTime since);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since")
    long countUsersCreatedSince(@Param("since") java.time.LocalDateTime since);
}