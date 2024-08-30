package com.example.linkmate.firebase.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.IdTokenProvider;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import com.google.auth.oauth2.AccessToken;

@Service
public class FirebaseAuthService {

    private static final String FIREBASE_CREDENTIALS_PATH = "firebase-service-account.json";

    public String getAccessToken() throws IOException {
        try (InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream(FIREBASE_CREDENTIALS_PATH)) {
            if (serviceAccount == null) {
                throw new FileNotFoundException("Firebase credentials file not found in the classpath");
            }
            GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount)
                    .createScoped(Collections.singletonList("https://www.googleapis.com/auth/cloud-platform"));
            credentials.refreshIfExpired();
            AccessToken token = credentials.getAccessToken();
            return token.getTokenValue();
        }
    }
}
