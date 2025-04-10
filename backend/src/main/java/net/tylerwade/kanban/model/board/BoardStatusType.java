package net.tylerwade.kanban.model.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a status type within a Kanban board.
 * This entity is mapped to the "board_status_types" table in the database.
 */
@Entity
@Table(name = "board_status_types")
@Getter
@Setter
@NoArgsConstructor
public class BoardStatusType {

    /**
     * The unique identifier for the status type.
     * This value is generated using a sequence strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    /**
     * The board to which this status type belongs.
     * This is a many-to-one relationship with the Board entity.
     * It is ignored during JSON serialization.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;

    /**
     * Retrieves the unique identifier of the associated board.
     *
     * @return the board ID as a string
     */
    private String getBoardId() {
        return board.getBoardId();
    }

    /**
     * The name or label of the status type.
     * This field is required and cannot be null.
     */
    @Column(nullable = false)
    private String status;

    /**
     * The color associated with the status type.
     * This field is required and cannot be null.
     */
    @Column(nullable = false)
    private String color;

    /**
     * Constructs a new BoardStatusType with the specified board, status, and color.
     *
     * @param board the board to which this status type belongs
     * @param status the name or label of the status type
     * @param color the color associated with the status type
     */
    public BoardStatusType(Board board, String status, String color) {
        this.board = board;
        this.status = status;
        this.color = color;
    }
}