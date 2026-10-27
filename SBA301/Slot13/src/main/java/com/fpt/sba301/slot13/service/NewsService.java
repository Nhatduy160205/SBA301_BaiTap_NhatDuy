package com.fpt.sba301.slot13.service;

import com.fpt.sba301.slot13.model.NewsRequestDTO;
import com.fpt.sba301.slot13.model.NewsResponseDTO;

import java.util.List;

public interface NewsService {
    List<NewsResponseDTO> getAllNews(String search, String category);
    NewsResponseDTO getNewsById(Long id);
    NewsResponseDTO createNews(NewsRequestDTO requestDTO);
    NewsResponseDTO updateNews(Long id, NewsRequestDTO requestDTO);
    void deleteNews(Long id);
}
