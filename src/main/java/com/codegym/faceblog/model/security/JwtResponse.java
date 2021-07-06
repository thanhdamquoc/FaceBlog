package com.codegym.faceblog.model.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class JwtResponse {
    private Long id;

    private String token;

    private String type = "Bearer";

    private String username;

    private String fullName;

    private Collection<? extends GrantedAuthority> roles;

    public JwtResponse(Long id, String token, String username, String fullName, Collection<? extends GrantedAuthority> roles) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Collection<? extends GrantedAuthority> getRoles() {
        return roles;
    }

    public void setRoles(Collection<? extends GrantedAuthority> roles) {
        this.roles = roles;
    }
}
