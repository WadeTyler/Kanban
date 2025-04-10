package net.tylerwade.kanban.service.user;

import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    User createOrUpdateUser(OAuth2User principal);

    User getUser(String userId) throws UnauthorizedException;
}
