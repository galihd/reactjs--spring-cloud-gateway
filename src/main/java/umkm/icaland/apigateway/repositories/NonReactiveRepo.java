package umkm.icaland.apigateway.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import umkm.icaland.apigateway.model.User;

@Repository
public interface NonReactiveRepo extends MongoRepository<User,String>{
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
