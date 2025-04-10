package net.tylerwade.kanban.exception;

/**
 * Custom exception class representing an "unauthorized" error.
 * This exception is used to indicate that a user is not authorized to perform a specific action.
 */
public class UnauthorizedException extends Exception {

    /**
     * Constructs a new UnauthorizedException with the specified detail message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public UnauthorizedException(String message) {
        super(message);
    }
}