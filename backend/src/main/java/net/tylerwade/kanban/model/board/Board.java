package net.tylerwade.kanban.model.board;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.User;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

/**
 * Represents a board in the Kanban application.
 * This entity is mapped to the "boards" table in the database.
 */
@Entity
@Table(name = "boards")
@Getter
@Setter
@NoArgsConstructor
public class Board {

    /**
     * The unique identifier for the board.
     * Defaults to a randomly generated UUID.
     */
    @Id
    private String boardId = UUID.randomUUID().toString();

    /**
     * The name of the board.
     * This field is required and cannot be null.
     */
    @Column(nullable = false)
    private String name;

    /**
     * A brief description of the board.
     */
    private String description;

    /**
     * The URL or path to the background image of the board.
     */
    private String backgroundImage;

    /**
     * The timestamp indicating when the board was created.
     * Defaults to the current system time.
     */
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    /**
     * The timestamp indicating when the board was last updated.
     * Defaults to the current system time.
     */
    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());

    /**
     * The owner of the board.
     * This is a many-to-one relationship with the User entity.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    /**
     * The list of board lists (columns) associated with the board.
     * This is a one-to-many relationship with the BoardList entity.
     * Cascade operations are applied, and orphaned lists are removed.
     */
    @OneToMany(mappedBy = "board", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardList> lists;

    /**
     * The list of members associated with the board.
     * This is a many-to-many relationship with the User entity.
     * A join table "board_members" is used to map the relationship.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "board_members",
            joinColumns = @JoinColumn(name = "board_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"board_id", "user_id"})
    )
    private List<User> members;

    /**
     * The list of status types associated with the board.
     * This is a one-to-many relationship with the BoardStatusType entity.
     * Cascade operations are applied, and orphaned status types are removed.
     */
    @OneToMany(mappedBy = "board", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardStatusType> statusTypes;

    /**
     * Constructs a new Board with the specified name, description, and owner.
     *
     * @param name the name of the board
     * @param description the description of the board
     * @param owner the owner of the board
     */
    public Board(String name, String description, User owner) {
        this.name = name;
        this.description = description;
        this.owner = owner;
    }
}