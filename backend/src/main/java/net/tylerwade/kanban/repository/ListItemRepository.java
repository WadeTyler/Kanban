package net.tylerwade.kanban.repository;

import net.tylerwade.kanban.model.board.ListItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListItemRepository extends JpaRepository<ListItem, Long> {
}
