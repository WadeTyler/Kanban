package net.tylerwade.kanban.service;

import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createOrUpdateUser(OAuth2User principal) {
        User user = userRepository.findById(principal.getAttribute("sub")).orElse(new User());

        user.setUserId(principal.getAttribute("sub"));
        user.setEmail(principal.getAttribute("email"));
        user.setName(principal.getAttribute("name"));
        user.setProfilePicture(principal.getAttribute("picture"));

        userRepository.save(user);
        return user;
    }

    public User getUser(String userId) throws UnauthorizedException {
        return userRepository.findById(userId).orElseThrow(() -> new UnauthorizedException("Unauthorized"));
    }
}
