package net.tylerwade.kanban.exception;

/**
 * Custom exception class representing a "not found" error.
 * This exception is used to indicate that a requested resource could not be found.
 */
public class NotFoundException extends Exception {

    /**
     * Constructs a new NotFoundException with the specified detail message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public NotFoundException(String message) {
        super(message);
    }
}