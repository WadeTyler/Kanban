package net.tylerwade.kanban.controller.AuthController;

import net.tylerwade.kanban.dto.APIResponse;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthControllerImpl implements AuthController {

    private final UserService userService;

    @Autowired
    public AuthControllerImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User principal) {
        User user = userService.createOrUpdateUser(principal);
        return ResponseEntity.status(HttpStatus.OK).body(APIResponse.success("User retrieved successfully", user));
    }
}
