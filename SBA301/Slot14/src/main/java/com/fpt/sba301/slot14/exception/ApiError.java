package com.fpt.sba301.slot14.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Standard Error Payload returned on failures")
public class ApiError {

    @Schema(description = "HTTP Status integer code", example = "404")
    private int status;

    @Schema(description = "Error title / reason phrase", example = "Not Found")
    private String error;

    @Schema(description = "Descriptive error message", example = "News article with ID #99 was not found.")
    private String message;

    @Schema(description = "Detailed list of field or diagnostic errors")
    private List<String> details;

    @Schema(description = "Timestamp when error was generated", example = "2026-10-02T14:30:00")
    private LocalDateTime timestamp;

    public ApiError() {
        this.timestamp = LocalDateTime.now();
    }

    public ApiError(int status, String error, String message, List<String> details) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
