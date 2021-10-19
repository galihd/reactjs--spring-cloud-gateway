package umkm.icaland.apigateway.security;

import static umkm.icaland.apigateway.security.authprovider.valueOf;

import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import umkm.icaland.apigateway.model.User;

public class AppUserDetails implements UserDetails,OidcUser {
    String username;
    String password;
    String email;
    String phone;
    String[] authorities;
    authprovider authprovider;
    OidcIdToken idToken;
    
    public AppUserDetails(User dbuser){
        this.username = dbuser.getEmail();
        this.password = dbuser.getPassword();
        this.email = dbuser.getEmail();
        this.phone = dbuser.getPhone();
        this.authorities = dbuser.getRoles().split(",");
    }

    public AppUserDetails(User dbuser,OidcIdToken idToken) {
        this.idToken = idToken;
        this.username = dbuser.getEmail();
        this.email = dbuser.getEmail();
        this.authprovider = valueOf(dbuser.getAuthprovider());
        this.authorities = dbuser.getRoles().split(",");
        
    }
    
    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return AuthorityUtils.createAuthorityList(authorities);
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getName() {
        return this.email;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
    public void setAuthorities(String[] authorities) {
        this.authorities = authorities;
    }

    public authprovider getAuthprovider() {
        return this.authprovider;
    }

    public void setAuthprovider(authprovider authprovider) {
        this.authprovider = authprovider;
    }

    @Override
    public Map<String, Object> getClaims() {
        return null;
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return null;
    }

    @Override
    public OidcIdToken getIdToken() {
        return this.idToken;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }
    
}
