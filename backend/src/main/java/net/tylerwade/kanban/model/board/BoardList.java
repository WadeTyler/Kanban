package net.tylerwade.kanban.model.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Represents a list within a Kanban board.
 * This entity is mapped to the "board_lists" table in the database.
 */
@Entity
@Table(name = "board_lists")
@Getter
@Setter
@NoArgsConstructor
public class BoardList {

    /**
     * The unique identifier for the board list.
     * This value is generated using a sequence strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long boardListId;

    /**
     * The board to which this list belongs.
     * This is a many-to-one relationship with the Board entity.
     * It is ignored during JSON serialization.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;

    /**
     * The name of the board list.
     * This field is required and cannot be null.
     */
    @Column(nullable = false)
    private String name;

    /**
     * The position of the board list within the board.
     * This field is required and cannot be null.
     */
    @Column(nullable = false)
    private int position;

    /**
     * The list of items within this board list.
     * This is a one-to-many relationship with the ListItem entity.
     * Cascade operations are applied, and orphaned items are removed.
     */
    @OneToMany(mappedBy = "boardList", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<ListItem> listItems;

    /**
     * Returns a string representation of the BoardList object.
     *
     * @return a string containing the board list's ID, associated board, name, and position
     */
    @Override
    public String toString() {
        return "BoardList{" +
                "boardListId=" + boardListId +
                ", board=" + board +
                ", name='" + name + '\'' +
                ", position=" + position +
                '}';
    }
}