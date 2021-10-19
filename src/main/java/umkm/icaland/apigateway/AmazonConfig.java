package umkm.icaland.apigateway;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.async.SdkAsyncHttpClient;
import software.amazon.awssdk.http.nio.netty.NettyNioAsyncHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
public class AmazonConfig {
    public final String bucketName = "umkm-buckets";
    @Bean
    S3AsyncClient asyncClient(){
        AwsCredentials credentials = 
            AwsBasicCredentials.create("AKIA6NKPG6N25UXASRPC", "BPC+DeJ+iCElfiNlH+QYxOXVmS3SoyJsJqfWR00Y");
        SdkAsyncHttpClient httpClient = NettyNioAsyncHttpClient.builder()
            .connectionTimeout(Duration.ofMinutes(5))
            .build();
        S3Configuration s3Configuration = S3Configuration.builder()
            .checksumValidationEnabled(true)
            .chunkedEncodingEnabled(true)
            .build();
        
        return S3AsyncClient.builder()
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .httpClient(httpClient)
            .serviceConfiguration(s3Configuration)
            .region(Region.AP_SOUTHEAST_1)
            .build();
    }
    public S3AsyncClient getAsyncClient(){
        return asyncClient();
    }
    
}
