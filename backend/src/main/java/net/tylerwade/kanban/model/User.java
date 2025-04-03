package net.tylerwade.kanban.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Timestamp;
import java.util.List;

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

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Board> boards;

    public User(String userId, String name, String email, String profilePicture) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
    }
}
