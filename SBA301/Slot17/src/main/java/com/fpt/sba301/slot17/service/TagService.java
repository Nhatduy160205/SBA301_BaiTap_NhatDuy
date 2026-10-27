package com.fpt.sba301.slot17.service;

import com.fpt.sba301.slot17.dto.TagDTO;
import com.fpt.sba301.slot17.entity.Tag;
import com.fpt.sba301.slot17.exception.ResourceNotFoundException;
import com.fpt.sba301.slot17.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(t -> new TagDTO(t.getId(), t.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public TagDTO createTag(String name) {
        String normalized = name == null ? "" : name.trim();
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Tag name is required");
        }
        if (tagRepository.existsByNameIgnoreCase(normalized)) {
            throw new IllegalArgumentException("Tag already exists: " + normalized);
        }
        Tag saved = tagRepository.save(new Tag(normalized));
        return new TagDTO(saved.getId(), saved.getName());
    }

    @Transactional
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));
        tagRepository.delete(tag);
    }
}
