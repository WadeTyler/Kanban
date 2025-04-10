package net.tylerwade.kanban.controller.advice;

import net.tylerwade.kanban.dto.APIResponse;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for the application.
 * This class provides centralized exception handling for all controllers
 * by using the @RestControllerAdvice annotation.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles BadRequestException and returns a 400 Bad Request response.
     *
     * @param e the BadRequestException instance
     * @return a ResponseEntity containing an error message
     */
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleBadRequestException(BadRequestException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(APIResponse.error(e.getMessage()));
    }

    /**
     * Handles NotFoundException and returns a 404 Not Found response.
     *
     * @param e the NotFoundException instance
     * @return a ResponseEntity containing an error message
     */
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<?> handleNotFoundException(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(e.getMessage()));
    }

    /**
     * Handles UnauthorizedException and returns a 401 Unauthorized response.
     *
     * @param e the UnauthorizedException instance
     * @return a ResponseEntity containing an error message
     */
    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<?> handleUnauthorizedException(UnauthorizedException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(APIResponse.error(e.getMessage()));
    }

    /**
     * Handles generic exceptions and returns a 500 Internal Server Error response.
     * Logs the error message to the console for debugging purposes.
     *
     * @param e the Exception instance
     * @return a ResponseEntity containing a generic error message
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<?> handleGenericException(Exception e) {
        System.out.println("An unexpected error occurred: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("An unexpected error occurred"));
    }
}