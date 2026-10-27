package com.fpt.sba301.slot14.controller;

import com.fpt.sba301.slot14.dto.NewsCreateDTO;
import com.fpt.sba301.slot14.dto.NewsDTO;
import com.fpt.sba301.slot14.exception.ApiError;
import com.fpt.sba301.slot14.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "News Management", description = "CRUD operations and search features for FUNewsManagementSystem articles")
@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @Operation(summary = "Get list of news articles", description = "Fetches all articles with optional keyword and category filters.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved news list")
    })
    @GetMapping
    public ResponseEntity<List<NewsDTO>> getAllNews(
            @Parameter(description = "Keyword to search within title, content, or author")
            @RequestParam(required = false) String search,
            @Parameter(description = "Category taxonomy to filter by")
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(newsService.getAllNews(search, category));
    }

    @Operation(summary = "Get news article by ID", description = "Retrieves complete details of a specific news article.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Article found"),
            @ApiResponse(responseCode = "404", description = "Article not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<NewsDTO> getNewsById(
            @Parameter(description = "Numeric identifier of the news article", example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @Operation(summary = "Create news article", description = "Submits a new news article for publishing. Requires non-empty fields.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Article successfully created"),
            @ApiResponse(responseCode = "400", description = "Validation failed or duplicate title", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<NewsDTO> createNews(@Valid @RequestBody NewsCreateDTO createDTO) {
        NewsDTO created = newsService.createNews(createDTO);
        URI location = URI.create("/api/news/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Update existing news article", description = "Updates all fields of an existing article.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Article updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "Article not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<NewsDTO> updateNews(
            @Parameter(description = "ID of article to update", example = "1")
            @PathVariable Long id,
            @Valid @RequestBody NewsCreateDTO createDTO) {
        return ResponseEntity.ok(newsService.updateNews(id, createDTO));
    }

    @Operation(summary = "Delete news article", description = "Permanently deletes an article from storage.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Article deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Article not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(
            @Parameter(description = "ID of article to delete", example = "1")
            @PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
