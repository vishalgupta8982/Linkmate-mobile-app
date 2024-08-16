package com.example.linkmate;

import org.bson.types.ObjectId;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

@SpringBootApplication
public class LinkmateApplication {

	
	public static void main(String[] args) {
		SpringApplication.run(LinkmateApplication.class, args);
	}
	 

}
