/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service: TagService
 */
package com.badmintion.backend.service;

import com.badmintion.backend.entity.Tag;

import java.util.List;

public interface TagService {
    List<Tag> getAllTags();
}
