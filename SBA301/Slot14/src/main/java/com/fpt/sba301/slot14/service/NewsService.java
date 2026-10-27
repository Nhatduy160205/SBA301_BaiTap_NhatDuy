package com.fpt.sba301.slot14.service;

import com.fpt.sba301.slot14.dto.NewsCreateDTO;
import com.fpt.sba301.slot14.dto.NewsDTO;

import java.util.List;

public interface NewsService {
    List<NewsDTO> getAllNews(String search, String category);
    NewsDTO getNewsById(Long id);
    NewsDTO createNews(NewsCreateDTO createDTO);
    NewsDTO updateNews(Long id, NewsCreateDTO createDTO);
    void deleteNews(Long id);
}
