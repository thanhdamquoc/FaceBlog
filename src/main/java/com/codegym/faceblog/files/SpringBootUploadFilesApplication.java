package com.codegym.faceblog.files;

import javax.annotation.Resource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.codegym.faceblog.service.files.FilesStorageService;

@SpringBootApplication
public class SpringBootUploadFilesApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootUploadFilesApplication.class, args);
    }
}
