package com.tradecrafter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pine_scripts")
public class PineScript {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String sourceCode;
    
    @Column(nullable = false)
    private String version = "1.0";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScriptStatus status = ScriptStatus.DRAFT;
    
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "pineScript", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<BacktestResult> backtestResults = new HashSet<>();
    
    @OneToMany(mappedBy = "pineScript", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Alert> alerts = new HashSet<>();
    
    // Constructors
    public PineScript() {}
    
    public PineScript(String name, String sourceCode, User user) {
        this.name = name;
        this.sourceCode = sourceCode;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public ScriptStatus getStatus() { return status; }
    public void setStatus(ScriptStatus status) { this.status = status; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Set<BacktestResult> getBacktestResults() { return backtestResults; }
    public void setBacktestResults(Set<BacktestResult> backtestResults) { this.backtestResults = backtestResults; }
    
    public Set<Alert> getAlerts() { return alerts; }
    public void setAlerts(Set<Alert> alerts) { this.alerts = alerts; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

enum ScriptStatus {
    DRAFT, ACTIVE, PAUSED, ARCHIVED
}