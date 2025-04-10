package net.tylerwade.kanban.controller.advice;

import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.security.Principal;

/**
 * Global exception handler for WebSocket messaging.
 * This class provides centralized exception handling for WebSocket-related exceptions
 * by using the @ControllerAdvice annotation.
 */
@ControllerAdvice
public class GlobalMessageExceptionHandler {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Constructs a new GlobalMessageExceptionHandler with the specified messaging template.
     *
     * @param messagingTemplate the SimpMessagingTemplate used to send messages to users
     */
    @Autowired
    public GlobalMessageExceptionHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handles BadRequestException and sends an error message to the user via WebSocket.
     *
     * @param e         the BadRequestException instance
     * @param principal the Principal representing the authenticated user
     */
    @MessageExceptionHandler(BadRequestException.class)
    public void handleBadRequestException(BadRequestException e, Principal principal) {
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", e.getMessage());
    }

    /**
     * Handles NotFoundException and sends an error message to the user via WebSocket.
     *
     * @param e         the NotFoundException instance
     * @param principal the Principal representing the authenticated user
     */
    @MessageExceptionHandler(NotFoundException.class)
    public void handleNotFoundException(NotFoundException e, Principal principal) {
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", e.getMessage());
    }

    /**
     * Handles UnauthorizedException and sends an error message to the user via WebSocket.
     *
     * @param e         the UnauthorizedException instance
     * @param principal the Principal representing the authenticated user
     */
    @MessageExceptionHandler(UnauthorizedException.class)
    public void handleUnauthorizedException(UnauthorizedException e, Principal principal) {
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", e.getMessage());
    }

    /**
     * Handles generic exceptions and sends a generic error message to the user via WebSocket.
     * Logs the error message to the console for debugging purposes.
     *
     * @param e         the Exception instance
     * @param principal the Principal representing the authenticated user
     */
    @MessageExceptionHandler(Exception.class)
    public void handleGenericException(Exception e, Principal principal) {
        System.out.println("An unexpected error occurred: " + e.getMessage());
        this.messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", "An unexpected error occurred");
    }

}