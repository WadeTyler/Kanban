package net.tylerwade.kanban.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.ListItem;

import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

/**
 * Represents a user in the Kanban application.
 * This entity is mapped to the "users" table in the database.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    /**
     * The unique identifier for the user.
     * This corresponds to the "sub" attribute in authentication tokens.
     */
    @Id
    private String userId;

    /**
     * The name of the user.
     */
    private String name;

    /**
     * The email address of the user.
     */
    private String email;

    /**
     * The URL of the user's profile picture.
     */
    private String profilePicture;

    /**
     * The timestamp indicating when the user was created.
     * Defaults to the current system time.
     */
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    /**
     * The list of boards the user is a member of.
     * This relationship is many-to-many and is lazily fetched.
     * It is ignored during JSON serialization.
     */
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "members")
    @JsonIgnore
    private List<Board> boards;

    /**
     * The list of items assigned to the user.
     * This relationship is one-to-many and is eagerly fetched.
     * It is ignored during JSON serialization.
     */
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "assignedTo")
    @JsonIgnore
    private List<ListItem> assignedItems;

    /**
     * Constructs a new User with the specified details.
     *
     * @param userId         the unique identifier for the user
     * @param name           the name of the user
     * @param email          the email address of the user
     * @param profilePicture the URL of the user's profile picture
     */
    public User(String userId, String name, String email, String profilePicture) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
    }

    /**
     * Checks if this user is equal to another object.
     * Two users are considered equal if their user IDs are the same.
     *
     * @param o the object to compare with
     * @return true if the objects are equal, false otherwise
     */
    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId);
    }

    /**
     * Computes the hash code for this user based on the user ID.
     *
     * @return the hash code of the user
     */
    @Override
    public int hashCode() {
        return Objects.hashCode(userId);
    }
}