package net.tylerwade.kanban.model.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.User;

import java.sql.Date;

@Entity
@Table(name = "list_items")
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long listItemId;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_list_id", nullable = false)
    @JsonIgnore
    private BoardList boardList;


    @Column(nullable = false)
    private int position;

    @Column(nullable = false)
    private String title;

    private String description;

    private Date dueDate;

    private String status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User assignedTo;

    private String color;


}
