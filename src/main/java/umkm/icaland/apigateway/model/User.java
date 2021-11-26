package umkm.icaland.apigateway.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "user")
public class User {
    @Id
    public String userId;
    @Field
    private String password;
    @Field
    public String email;
    @Field
    public String phone;
    @Field
    public String address;
    @Field
    public String postalcode;
    @Field
    public String roles;
    @Field
    public String authprovider;
    @Field
    public String avatar_url;


    public User() {
    }

    public User(String userId, String password, String email, String phone, String address, String postalcode, String roles, String authprovider, String avatar_url) {
        this.userId = userId;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.postalcode = postalcode;
        this.roles = roles;
        this.authprovider = authprovider;
        this.avatar_url = avatar_url;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return this.password;
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

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPostalcode() {
        return this.postalcode;
    }

    public void setPostalcode(String postalcode) {
        this.postalcode = postalcode;
    }

    public String getRoles() {
        return this.roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public String getAuthprovider() {
        return this.authprovider;
    }

    public void setAuthprovider(String authprovider) {
        this.authprovider = authprovider;
    }

    public String getAvatar_url() {
        return this.avatar_url;
    }

    public void setAvatar_url(String avatar_url) {
        this.avatar_url = avatar_url;
    }


    @Override
    public String toString() {
        return "{" +
            " id='" + getUserId() + "'" +
            ", password='" + getPassword() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", address='" + getAddress() + "'" +
            ", postalcode='" + getPostalcode() + "'" +
            ", roles='" + getRoles() + "'" +
            ", authprovider='" + getAuthprovider() + "'" +
            ", avatar_url='" + getAvatar_url() + "'" +
            "}";
    }



}