package net.tylerwade.kanban.model.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "board_lists")
@Getter
@Setter
@NoArgsConstructor
public class BoardList {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long boardListId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int position;

    @OneToMany(mappedBy = "boardList", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ListItem> listItems;

}
