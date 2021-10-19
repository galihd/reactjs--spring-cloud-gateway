package umkm.icaland.apigateway.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import reactor.core.publisher.Mono;
import umkm.icaland.apigateway.model.User;

@Repository
public interface AppUserRepo extends ReactiveMongoRepository<User,String>{
    Mono<User> findByEmail(String email);
    Mono<Boolean> existsByEmail(String email);
}
