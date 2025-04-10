package net.tylerwade.kanban.exception;

import java.io.IOException;

/**
 * Custom exception class representing a bad request error.
 * This exception extends the {@link IOException} class and is used to indicate
 * that a client request is invalid or cannot be processed.
 */
public class BadRequestException extends IOException {

    /**
     * Constructs a new BadRequestException with the specified detail message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public BadRequestException(String message) {
        super(message);
    }
}