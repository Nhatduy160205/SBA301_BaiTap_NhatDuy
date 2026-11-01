/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Controller: TagController
 */
package com.badmintion.backend.controller;

import com.badmintion.backend.dto.response.ApiResponse;
import com.badmintion.backend.entity.Tag;
import com.badmintion.backend.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Tag>>> getAllTags() {
        List<Tag> list = tagService.getAllTags();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
