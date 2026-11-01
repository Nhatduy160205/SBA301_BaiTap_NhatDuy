/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service Implementation: TagServiceImpl
 */
package com.badmintion.backend.service.impl;

import com.badmintion.backend.entity.Tag;
import com.badmintion.backend.repository.TagRepository;
import com.badmintion.backend.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
}
