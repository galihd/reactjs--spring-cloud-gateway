package umkm.icaland.apigateway.security;

import java.time.Duration;
import java.util.Collection;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.ReactiveAuthenticationManagerResolver;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtReactiveAuthenticationManager;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.session.CookieWebSessionIdResolver;
import org.springframework.web.server.session.WebSessionIdResolver;

import reactor.core.publisher.Mono;
import umkm.icaland.apigateway.model.User;


@Configuration
@EnableWebFluxSecurity
public class Securityconfig{
    
    private final OAuth2ResourceServerProperties resourceServerProperties;
    private final AppUserDetailsService appUserDetailsService;

    @Autowired
    public Securityconfig(OAuth2ResourceServerProperties resourceServerProperties, AppUserDetailsService appUserDetailsService) {
        this.resourceServerProperties = resourceServerProperties;
        this.appUserDetailsService = appUserDetailsService;
    }

    @Bean
    SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http){
        return http
        .cors(corsspec->{
            corsspec.configurationSource(corsconfig());
        })
        .csrf(csrfconfig -> {
            csrfconfig.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse());
        })
        .addFilterAt(authenticationWebFilter(), SecurityWebFiltersOrder.AUTHENTICATION)
        .authorizeExchange(exchange->{
            exchange
            .pathMatchers(HttpMethod.GET,
            "favicon.png",
            "/oauth2/**",
            "/sockjs-node*",
            "/*",
            "/css/**",
            "/js/**",
            "/images/**",
            "/videos/**",
            "/login/**",
            "/products/**",
            "/api/products/**").permitAll()
            .pathMatchers(HttpMethod.POST,"/login*","/api/user","/oauthlogin","/adminlogin").permitAll()
            .pathMatchers(HttpMethod.GET,"/api/payments").hasAnyAuthority("appDev","appAdmin")
            .pathMatchers(HttpMethod.POST,"/api/products**").hasAnyAuthority("appDev","appAdmin")
            .pathMatchers(HttpMethod.PUT,"/api/products**","/api/payment**").hasAnyAuthority("appDev","appAdmin")
            .pathMatchers(HttpMethod.DELETE,"/api/products**","/api/payment**").hasAnyAuthority("appDev","appAdmin")
            .pathMatchers("/api/order/**","/api/userorder**","/api/payment**").hasAnyAuthority("appUser","oauth2AppUser","appDev","appAdmin")
            .anyExchange().authenticated();
            })
            .formLogin().disable()
            .httpBasic().disable()
            .oauth2ResourceServer(resourceconfig->{
                resourceconfig
                .jwt(jwtconfig -> 
                    jwtconfig.authenticationManager(jwtReactiveAuthenticationManager()));
        })
        .logout(logoutspec -> logoutspec.logoutUrl("/logout"))
        .build();

    }

    @Bean
    WebSessionIdResolver idResolver(){
        CookieWebSessionIdResolver resolver = new CookieWebSessionIdResolver();
        resolver.setCookieName("JSESSIONID");
        resolver.setCookieMaxAge(Duration.ofMinutes(180));
        resolver.addCookieInitializer((builder)->{
            builder.httpOnly(true)
                    .domain("icaland.id")
                    .path("/")
                    .sameSite("Strict")
                .build();
        });

        return resolver;
    }
    

    AuthenticationWebFilter authenticationWebFilter(){
        ServerWebExchangeMatcher securedEndpoints = 
            ServerWebExchangeMatchers.matchers(
                ServerWebExchangeMatchers.pathMatchers("/api/order/**","/api/userorder/**")
                ,ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/api/products/**")
                ,ServerWebExchangeMatchers.pathMatchers(HttpMethod.PUT, "/api/products/**")
                ,ServerWebExchangeMatchers.pathMatchers(HttpMethod.DELETE, "/api/products/**")
            );
        ObjectMapper JSONmapper = new ObjectMapper();
        ReactiveAuthenticationManagerResolver<ServerWebExchange> authResolver = (exchange)->{
            return exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION) != null ? 
                Mono.just(jwtReactiveAuthenticationManager()) : Mono.just(aReactiveAuthenticationManager()); 
        };
        AuthenticationWebFilter aFilter = new AuthenticationWebFilter(authResolver);
        aFilter.setRequiresAuthenticationMatcher(securedEndpoints);
        aFilter.setServerAuthenticationConverter((swe)->{
            String token = swe.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if(token != null){
                System.out.println("token : " +token.substring("Bearer ".length()));
                return Mono.just(new BearerTokenAuthenticationToken(token.substring("Bearer ".length())));
            }
            return swe.getSession()
                    .filter(sessionobj -> sessionobj.getAttribute("user") != null)
                    .flatMap(swesession ->{
                        User sessionuser = new User();
                        try {
                            sessionuser = JSONmapper.readValue(swesession.getAttribute("user").toString(), User.class);
                            System.out.println("user session : " + sessionuser.toString());
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }
                        return Mono.just(Authentication.class.cast(
                            new UsernamePasswordAuthenticationToken(
                                sessionuser.getEmail(), sessionuser.getPassword())));
                    })
                    .switchIfEmpty(Mono.error(new AuthenticationCredentialsNotFoundException("session not found")));
        });
        return aFilter;
    }

    @Bean
    PasswordEncoder bcryptEncoder(){
        return new BCryptPasswordEncoder(10);
    }
    
    @Bean
    ReactiveJwtDecoder jwtdecoder(){
        return new NimbusReactiveJwtDecoder(this.resourceServerProperties.getJwt().getJwkSetUri());
    }

    @Bean
    UserDetailsRepositoryReactiveAuthenticationManager aReactiveAuthenticationManager(){
        UserDetailsRepositoryReactiveAuthenticationManager authManager = 
            new UserDetailsRepositoryReactiveAuthenticationManager(appUserDetailsService);
        authManager.setPasswordEncoder(bcryptEncoder());
        return authManager;
    }

    @Bean
    @Primary
    JwtReactiveAuthenticationManager jwtReactiveAuthenticationManager(){
        JwtReactiveAuthenticationManager authManager = new JwtReactiveAuthenticationManager(jwtdecoder());
        authManager.setJwtAuthenticationConverter(grantedAuthoritiesExtractor());
        return authManager;
    }

    Converter<Jwt,Mono<AbstractAuthenticationToken>> grantedAuthoritiesExtractor(){
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
            new Converter<Jwt,Collection<GrantedAuthority>>(){
            @Override
            public Collection<GrantedAuthority> convert(Jwt source) {
                Optional<User> dbuser = appUserDetailsService.NonReactivefindByEmail(source.getClaim("email"));
                if(dbuser.isPresent()){
                    return new AppUserDetails(dbuser.get()).getAuthorities();
                }else{
                    return AuthorityUtils.createAuthorityList("oauth2AppUser");
                }
            }
        });
        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }
    // @Bean
    // OidcAuthorizationCodeReactiveAuthenticationManager oReactiveAuthenticationManager(){
    //     OidcAuthorizationCodeReactiveAuthenticationManager authManager = 
    //         new OidcAuthorizationCodeReactiveAuthenticationManager(new WebClientReactiveAuthorizationCodeTokenResponseClient(), 
    //             appUserDetailsService);
    //     return authManager;
    // }

        
    @Bean
    CorsConfigurationSource corsconfig(){
        final CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setMaxAge(5000L);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return urlBasedCorsConfigurationSource;
    }

}
