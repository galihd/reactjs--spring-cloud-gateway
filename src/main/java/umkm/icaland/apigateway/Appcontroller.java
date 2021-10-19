package umkm.icaland.apigateway;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Duration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.WebSession;

import reactor.core.publisher.Mono;
import software.amazon.awssdk.utils.IoUtils;
import umkm.icaland.apigateway.model.User;
import umkm.icaland.apigateway.security.AppUserDetailsService;
import umkm.icaland.apigateway.security.authprovider;
@Controller
public class Appcontroller {
    @Autowired
    PasswordEncoder bcryptencoder;
    @Autowired
    ReactiveJwtDecoder jwtDecoder;


    private final AppUserDetailsService userService;
    private final UserDetailsRepositoryReactiveAuthenticationManager authManager;
    private ObjectMapper JSONmapper = new ObjectMapper();

    @Autowired
    public Appcontroller(AppUserDetailsService userService, UserDetailsRepositoryReactiveAuthenticationManager authManager) {
        this.userService = userService;
        this.authManager = authManager;
    }



    @GetMapping(path = {"","/{x:^(?!js|api|images|videos|favicon|.well-known|oauth2)}**/**"}, produces = MediaType.ALL_VALUE)
    public String indexpage(){
        return "index";
    }
    @GetMapping (path = "/robots.txt",produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public byte[] robots() throws IOException, URISyntaxException{
        return IoUtils.toByteArray(getClass().getClassLoader().getResourceAsStream("robots.txt"));
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<User>> loginuser(@RequestBody User user,WebSession session){
        return 
            authManager.authenticate(new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                    user.getPassword()))
            .flatMap(authentication -> {
                return authentication.isAuthenticated() ? userService.findByEmail(user.getEmail()) : Mono.empty();
            })
            .flatMap(dbuser -> {
                try {
                    session.getAttributes().putIfAbsent("user", JSONmapper.writeValueAsString(user));
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
                session.setMaxIdleTime(Duration.ofMinutes(60));
                return Mono.just(ResponseEntity.ok(dbuser));
            })
            .switchIfEmpty(Mono.just(ResponseEntity.badRequest().build()));
    }

    @PostMapping(path ="/oauthlogin")
    @ResponseBody
    public Mono<ResponseEntity<Mono<User>>> manageoauthuser(@AuthenticationPrincipal Jwt jwt, @RequestParam("provider") String auth_provider){
        return jwtDecoder.decode(jwt.getTokenValue())
        .flatMap(decodedjwt -> {
            System.out.println("incoming jwt : " + decodedjwt.getTokenValue());
            System.out.println("incoming provider : "+ auth_provider);
            User user = new User();
            user.setEmail(decodedjwt.getClaim("email"));
            user.setAvatar_url(decodedjwt.getClaim("picture"));
            user.setAuthprovider(authprovider.valueOf(auth_provider).name());
            return Mono.just(ResponseEntity.ok().body(userService.manageOauthUser(user)));
        });
        
    }

    @PostMapping(path = "/adminlogin")
    @ResponseBody
    public Mono<ResponseEntity<Mono<User>>> adminLogin(@AuthenticationPrincipal Jwt jwt){
        return manageoauthuser(jwt, authprovider.google.name())
                .flatMap(responseentity -> responseentity.getBody())
                .filter(user -> user.roles.contains("appDev") || user.roles.contains("appAdmin"))
                .map(adminuser -> ResponseEntity.ok().body(Mono.just(adminuser)))
                .switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));
                
    }

}
