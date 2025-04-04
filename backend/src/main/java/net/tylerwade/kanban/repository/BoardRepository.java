package net.tylerwade.kanban.repository;

import net.tylerwade.kanban.model.Board;
import net.tylerwade.kanban.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, String> {

    boolean existsByNameAndOwner(String name, User user);

    Iterable<Board> findAllByOwnerOrderByUpdatedAtDesc(User user);

    Optional<Board> findByBoardIdAndOwner(String boardId, User user);
}
