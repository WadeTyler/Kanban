package net.tylerwade.kanban.model.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.User;

import java.sql.Date;
import java.util.Objects;

/**
 * Represents an item within a Kanban board list.
 * This entity is mapped to the "list_items" table in the database.
 */
@Entity
@Table(name = "list_items")
@Getter
@Setter
@NoArgsConstructor
public class ListItem {

    /**
     * The unique identifier for the list item.
     * This value is generated using a sequence strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long listItemId;

    /**
     * The board list to which this item belongs.
     * This is a many-to-one relationship with the BoardList entity.
     * It is ignored during JSON serialization.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_list_id", nullable = false)
    @JsonIgnore
    private BoardList boardList;

    /**
     * Retrieves the unique identifier of the associated board list.
     *
     * @return the board list ID as a Long
     */
    public Long getBoardListId() {
        return boardList.getBoardListId();
    }

    /**
     * The position of the list item within the board list.
     * This field is required and cannot be null.
     */
    @Column(nullable = false)
    private int position;

    /**
     * The title of the list item.
     * This field is required and cannot be null.
     */
    @Column(nullable = false)
    private String title;

    /**
     * A brief description of the list item.
     */
    private String description;

    /**
     * The due date for the list item.
     */
    private Date dueDate;

    /**
     * The status type of the list item.
     * This is a many-to-one relationship with the BoardStatusType entity.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private BoardStatusType status;

    /**
     * The user to whom the list item is assigned.
     * This is a many-to-one relationship with the User entity.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    /**
     * The color associated with the list item.
     */
    private String color;

    /**
     * Checks if this list item is equal to another object.
     * Two list items are considered equal if their IDs are the same.
     *
     * @param o the object to compare with
     * @return true if the objects are equal, false otherwise
     */
    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ListItem listItem = (ListItem) o;
        return Objects.equals(listItemId, listItem.listItemId);
    }

    /**
     * Computes the hash code for this list item based on the list item ID.
     *
     * @return the hash code of the list item
     */
    @Override
    public int hashCode() {
        return Objects.hashCode(listItemId);
    }
}