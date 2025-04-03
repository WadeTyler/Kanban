package net.tylerwade.kanban.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class APIResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;

    public APIResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> APIResponse<T> success(String message, T data) {
        return new APIResponse<>(true, message, data);
    }

    public static <T> APIResponse<T> success(String message) {
        return new APIResponse<>(true, message, null);
    }

    public static <T> APIResponse<T> error(String message, T data) {
        return new APIResponse<>(false, message, data);
    }

    public static <T> APIResponse<T> error(String message) {
        return new APIResponse<>(false, message, null);
    }



}
