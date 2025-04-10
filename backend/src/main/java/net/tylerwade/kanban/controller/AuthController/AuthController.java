package net.tylerwade.kanban.controller.AuthController;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller interface for managing user authentication in the Kanban application.
 * Provides endpoints for retrieving user information.
 */
@RestController
public interface AuthController {

    /**
     * Retrieves the authenticated user's information.
     *
     * @param principal the OAuth2 user information obtained during authentication
     * @return ResponseEntity containing the user's information
     */
    @GetMapping({"", "/"})
    ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User principal);
}
