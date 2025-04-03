package net.tylerwade.kanban.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Timestamp;

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

    public User(String userId, String name, String email, String profilePicture) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
    }
}
