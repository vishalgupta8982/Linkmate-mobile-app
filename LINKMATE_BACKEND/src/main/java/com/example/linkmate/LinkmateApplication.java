package com.example.linkmate;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LinkmateApplication {

	
	public static void main(String[] args) {
		SpringApplication.run(LinkmateApplication.class, args);
	}
	 

}
