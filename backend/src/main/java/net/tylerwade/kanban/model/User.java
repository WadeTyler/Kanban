package net.tylerwade.kanban.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.board.Board;

import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    private String userId;  // sub attribute

    private String name;

    private String email;

    private String profilePicture;

    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "members", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Board> boards;

    public User(String userId, String name, String email, String profilePicture) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(userId);
    }
}
