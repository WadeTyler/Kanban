package net.tylerwade.kanban.model.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.User;

import java.sql.Date;
import java.util.Objects;

@Entity
@Table(name = "list_items")
@Getter
@Setter
@NoArgsConstructor
public class ListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long listItemId;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_list_id", nullable = false)
    @JsonIgnore
    private BoardList boardList;


    public Long getBoardListId() {
        return boardList.getBoardListId();
    }

    @Column(nullable = false)
    private int position;

    @Column(nullable = false)
    private String title;

    private String description;

    private Date dueDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private BoardStatusType status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    private String color;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ListItem listItem = (ListItem) o;
        return Objects.equals(listItemId, listItem.listItemId);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(listItemId);
    }
}
