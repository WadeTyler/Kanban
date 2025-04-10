package net.tylerwade.kanban.service.board;

import net.tylerwade.kanban.dto.AddMemberRequest;
import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.dto.CreateUpdateStatusRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BoardService {

    Iterable<Board> getAllUserBoards(User user);

    Board createBoard(CreateBoardRequest request, User user) throws BadRequestException;

    Board getBoardById(String boardId, User user) throws NotFoundException;

    List<User> addMemberToBoard(Board board, User user, AddMemberRequest addMemberRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    List<User> removeMemberFromBoard(Board board, User user, String memberId) throws UnauthorizedException, NotFoundException;

    void leaveBoard(Board board, User user) throws BadRequestException;

    Board promoteUserToOwner(Board board, User user, String memberId) throws UnauthorizedException, NotFoundException;

    Board createStatusType(Board board, CreateUpdateStatusRequest request) throws BadRequestException, NotFoundException;

    Board removeStatusType(Board board, Long statusTypeId) throws NotFoundException;

    Board updateStatusType(Board board, Long statusTypeId, CreateUpdateStatusRequest request) throws BadRequestException, NotFoundException;

    Boolean deleteBoard(Board board, User user) throws UnauthorizedException, NotFoundException;
}
