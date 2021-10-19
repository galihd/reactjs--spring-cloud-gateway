package umkm.icaland.apigateway;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.ResourceHandlerRegistry;
import org.springframework.web.reactive.config.ViewResolverRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.thymeleaf.spring5.view.reactive.ThymeleafReactiveViewResolver;

@Configuration
public class Webfluxconfig implements WebFluxConfigurer{
    @Autowired
    ThymeleafReactiveViewResolver thymeleafReactiveViewResolver;

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.viewResolver(thymeleafReactiveViewResolver);
        WebFluxConfigurer.super.configureViewResolvers(registry);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
        .addResourceLocations("classpath:/static/images/");
        registry.addResourceHandler("/videos/*")
        .addResourceLocations("classpath:/static/videos/");
        registry.addResourceHandler("/favicon.png")
        .addResourceLocations("file:classpath:/");
        WebFluxConfigurer.super.addResourceHandlers(registry);
        }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedHeaders("*")
            .allowedMethods("*");
        WebFluxConfigurer.super.addCorsMappings(registry);
    }
    
}
