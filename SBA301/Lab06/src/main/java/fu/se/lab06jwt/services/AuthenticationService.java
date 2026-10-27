package fu.se.lab06jwt.services;

import fu.se.lab06jwt.dtos.LoginUserDto;
import fu.se.lab06jwt.dtos.RegisterUserDto;
import fu.se.lab06jwt.entities.User;
import fu.se.lab06jwt.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository,
                                 PasswordEncoder passwordEncoder,
                                 AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public User signup(RegisterUserDto input) {
        // Business logic validation strictly executed in Service layer
        if (input == null) {
            throw new IllegalArgumentException("Register data cannot be null");
        }
        String email = input.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already exists");
        }

        User user = new User();
        user.setFullName(input.getFullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(input.getPassword()));

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        // Authentication coordination strictly in Service layer
        if (input == null) {
            throw new IllegalArgumentException("Login data cannot be null");
        }
        String email = input.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, input.getPassword())
        );

        return userRepository.findByEmail(email).orElseThrow();
    }
}