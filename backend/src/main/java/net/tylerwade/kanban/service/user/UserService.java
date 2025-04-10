package net.tylerwade.kanban.service.user;

import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

/**
 * Service interface for managing user-related operations.
 * Provides methods to create or update a user and retrieve user details.
 */
@Service
public interface UserService {

    /**
     * Creates or updates a user based on the provided OAuth2 principal.
     *
     * @param principal the OAuth2 user information obtained during authentication
     * @return the created or updated User object
     */
    User createOrUpdateUser(OAuth2User principal);

    /**
     * Retrieves a user by their unique user ID.
     *
     * @param userId the unique identifier of the used
     * @return the User object corresponding to the given user ID
     * @throws UnauthorizedException if the user cannot be found or is unauthorized
     */
    User getUser(String userId) throws UnauthorizedException;
}