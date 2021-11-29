package umkm.icaland.apigateway;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.boot.autoconfigure.data.redis.LettuceClientConfigurationBuilderCustomizer;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.session.data.redis.config.annotation.web.server.EnableRedisWebSession;
import org.springframework.web.reactive.function.client.WebClient;


@EnableMongoRepositories
@EnableReactiveMongoRepositories
@SpringBootApplication
@EnableRedisWebSession
public class ApiGatewayApplication {

	@Bean
	WebClient.Builder webClient(){
		return WebClient.builder();
	}
	// @Bean
	// LettuceClientConfigurationBuilderCustomizer customizer(){
	// 	return clientconfig -> {
	// 		if(clientconfig.build().isUseSsl()){
	// 			clientconfig.useSsl().disablePeerVerification();
	// 		}
	// 	};
	// }
	@Bean
	LettuceConnectionFactory lettuceConnectionFactory(){
		return new LettuceConnectionFactory("rediscache-001.aa8t0s.0001.apse1.cache.amazonaws.com", 6379);
	}

	@Bean
	RouteLocator routeLocator(RouteLocatorBuilder builder){
		return builder
		.routes()
				.route(backend -> 
					backend
					.path("/api/**")
					.filters(filter -> 
							filter
								.tokenRelay()
								.stripPrefix(1)
								.requestRateLimiter(config ->{
									config.setRateLimiter(redisRateLimiter())
										.setDenyEmptyKey(false);
								})
								.saveSession()
								.removeResponseHeader(HttpHeaders.WWW_AUTHENTICATE)
					)
					// .uri("https://api.icaland.id/")
					.uri("https://api.icaland.id/")
					)
					.build();
						
	}
	@Bean 
	RedisRateLimiter redisRateLimiter(){
		return new RedisRateLimiter(10, 20);
	}

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

}
