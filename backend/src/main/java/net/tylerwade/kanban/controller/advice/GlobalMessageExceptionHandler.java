package net.tylerwade.kanban.controller.advice;

import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.security.Principal;

@ControllerAdvice
public class GlobalMessageExceptionHandler {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public GlobalMessageExceptionHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageExceptionHandler(BadRequestException.class)
    public void handleBadRequestException(BadRequestException e, Principal principal) {
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", e.getMessage());
    }

    @MessageExceptionHandler(NotFoundException.class)
    public void handleNotFoundException(NotFoundException e, Principal principal) {
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", e.getMessage());
    }

    @MessageExceptionHandler(UnauthorizedException.class)
    public void handleUnauthorizedException(UnauthorizedException e, Principal principal) {
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", e.getMessage());
    }

    @MessageExceptionHandler(Exception.class)
    public void handleGenericException(Exception e, Principal principal) {
        System.out.println("An unexpected error occurred: " + e.getMessage());
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", "An unexpected error occurred");
    }

}
