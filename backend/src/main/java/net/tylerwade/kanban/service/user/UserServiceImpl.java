package net.tylerwade.kanban.service.user;

import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createOrUpdateUser(OAuth2User principal) {
        User user = userRepository.findById(principal.getAttribute("sub")).orElse(new User());

        // If user details are not up to date, then update
        if (user.getUserId() == null || !user.getUserId().equals(principal.getAttribute("sub"))
                || user.getEmail() == null || !user.getEmail().equals(principal.getAttribute("email"))
                || user.getName() == null || !user.getName().equals(principal.getAttribute("name"))
                || user.getProfilePicture() == null || !user.getProfilePicture().equals(principal.getAttribute("picture"))) {
            // Update details
            user.setUserId(principal.getAttribute("sub"));
            user.setEmail(principal.getAttribute("email"));
            user.setName(principal.getAttribute("name"));
            user.setProfilePicture(principal.getAttribute("picture"));

            userRepository.save(user);
        }

        return user;
    }

    public User getUser(String userId) throws UnauthorizedException {
        return userRepository.findById(userId).orElseThrow(() -> new UnauthorizedException("Unauthorized"));
    }
}
