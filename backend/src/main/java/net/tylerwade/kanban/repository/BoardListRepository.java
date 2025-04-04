package net.tylerwade.kanban.repository;

import net.tylerwade.kanban.model.board.BoardList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardListRepository extends JpaRepository<BoardList, Long> {
}
