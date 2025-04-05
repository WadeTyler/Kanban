package net.tylerwade.kanban.repository;

import jakarta.transaction.Transactional;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardStatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardStatusTypeRepository extends JpaRepository<BoardStatusType, Long> {

    @Modifying
    @Transactional
    void deleteByIdAndBoard(Long id, Board board);

    Optional<BoardStatusType> findByIdAndBoard(Long statusTypeId, Board board);

    BoardStatusType status(String status);
}
