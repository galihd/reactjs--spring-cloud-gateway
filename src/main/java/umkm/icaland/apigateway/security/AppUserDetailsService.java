package umkm.icaland.apigateway.security;


import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcReactiveOAuth2UserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import umkm.icaland.apigateway.AmazonConfig;
import umkm.icaland.apigateway.model.User;
import umkm.icaland.apigateway.repositories.AppUserRepo;
import umkm.icaland.apigateway.repositories.NonReactiveRepo;

@Service
public class AppUserDetailsService extends OidcReactiveOAuth2UserService implements ReactiveUserDetailsService{
    @Autowired
    WebClient.Builder wBuilder;
    @Autowired 
    AppUserRepo appUserRepo;
    @Autowired
    NonReactiveRepo nonReactiveRepo;
    @Autowired
    AmazonConfig amazonConfig;

    @Override
    public Mono<UserDetails> findByUsername(String email) {
        return appUserRepo.findByEmail(email).flatMap(user -> {
            if(user.roles.equalsIgnoreCase("oauth2AppUser")){
                return Mono.empty();
            }else{
                return Mono.just(new AppUserDetails(user));
            }
        });
    }
    public Mono<User> findByEmail(String email){
        return appUserRepo.findByEmail(email);
    }
    public Optional<User> NonReactivefindByEmail(String email){
        return nonReactiveRepo.findByEmail(email);
    }
    
    private Mono<User> manageAvatar(User user){
        GetObjectRequest getRequest = GetObjectRequest.builder()
            .bucket(amazonConfig.bucketName)
            .key("useravatar/"+user.getEmail())
            .build();

        return wBuilder.build().get().uri(user.getAvatar_url()).retrieve().bodyToMono(byte[].class)
            .flatMap(resource -> {
                PutObjectRequest request = PutObjectRequest.builder()
                .bucket(amazonConfig.bucketName)
                .key("useravatar/"+user.getEmail())
                .contentLength(Long.valueOf(resource.length))
                .build();
                return Mono.fromFuture(amazonConfig.getAsyncClient().putObject(request, AsyncRequestBody.fromBytes(resource)));
            })
            .flatMap(response -> {
                return response.sdkHttpResponse().isSuccessful() ?
                    Mono.fromFuture(amazonConfig.getAsyncClient().getObject(getRequest, AsyncResponseTransformer.toBytes()))
                        : Mono.empty();  
            })
            .flatMap(getresponse -> {
               return Mono.just(Base64.getEncoder().encodeToString(getresponse.asByteArray()));
            })
            .map(base64string -> {
                user.setAvatar_url(base64string);
                return user;
            });        
    }   

    public Mono<User> manageOauthUser(User user){
        return appUserRepo.existsByEmail(user.getEmail())
            .flatMap(exist -> {
                if(!exist){
                    user.setRoles("oauth2AppUser");
                    return appUserRepo.save(user);
                }
                return appUserRepo.findByEmail(user.getEmail())
                    .flatMap(existuser->{
                        existuser.setAvatar_url(user.getAvatar_url());
                        return appUserRepo.save(existuser);
                    });
            })
            .flatMap(saveduser -> {
                return manageAvatar(saveduser);
            });
    }

    @Override
    public Mono<OidcUser> loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        return super.loadUser(userRequest).flatMap(oauthuser ->{
            System.out.println("executing db check email : " + oauthuser.getAttribute("email"));
            if(oauthuser.getAttribute("email").toString().isEmpty()){
                return Mono.error(new OAuth2AuthorizationException(null, "your email is not accessible please make sure to make it publicly available"));
            }else{
                return appUserRepo.findByEmail(oauthuser.getAttribute("email"))
                .flatMap(existinguser -> {
                    System.out.println("db check existing user : " + existinguser.toString());
                    if(existinguser.getUserId() != null){
                        return Mono.just(new AppUserDetails(existinguser, userRequest.getIdToken()));
                    }else{
                        User user = new User();
                        user.setEmail(oauthuser.getAttribute("email"));
                        user.setRoles("oauth2AppUser");
                        user.setAuthprovider(authprovider.valueOf(userRequest.getClientRegistration().getRegistrationId()).name());
                        appUserRepo.save(user);
                        return Mono.just(new AppUserDetails(user, oauthuser.getIdToken()));
                    }
                })
                .flatMap(appuser -> {
                    return appuser.getAuthprovider().equals(authprovider.valueOf(userRequest.getClientRegistration().getRegistrationId())) ?
                    Mono.just(appuser) : Mono.error(new OAuth2AuthenticationException(null,"email already registered"));
                });
            }
        });
    }
    
}

