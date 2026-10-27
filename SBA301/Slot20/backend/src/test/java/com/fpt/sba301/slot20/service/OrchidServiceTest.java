package com.fpt.sba301.slot20.service;

import com.fpt.sba301.slot20.entity.Orchid;
import com.fpt.sba301.slot20.entity.OrchidCategory;
import com.fpt.sba301.slot20.exception.ResourceNotFoundException;
import com.fpt.sba301.slot20.repository.IOrchidCategoryRepository;
import com.fpt.sba301.slot20.repository.IOrchidRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrchidServiceTest {

    @Mock
    private IOrchidRepository orchidRepository;

    @Mock
    private IOrchidCategoryRepository categoryRepository;

    @InjectMocks
    private OrchidService orchidService;

    private OrchidCategory testCat;
    private Orchid testOrchid;

    @BeforeEach
    void setUp() {
        testCat = new OrchidCategory(1L, "Cattleya");
        testOrchid = new Orchid(10L, "Orchid 10", true, true, "Desc", "url", testCat);
    }

    @Test
    void getOrchidById_WhenExists_ShouldReturnOrchid() {
        when(orchidRepository.findById(10L)).thenReturn(Optional.of(testOrchid));

        Orchid result = orchidService.getOrchidById(10L);

        assertNotNull(result);
        assertEquals("Orchid 10", result.getOrchidName());
        verify(orchidRepository, times(1)).findById(10L);
    }

    @Test
    void getOrchidById_WhenNotExists_ShouldThrowResourceNotFound() {
        when(orchidRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orchidService.getOrchidById(999L));
    }

    @Test
    void createOrchid_WhenValid_ShouldSaveInDatabase() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCat));
        when(orchidRepository.save(any(Orchid.class))).thenAnswer(i -> {
            Orchid o = i.getArgument(0);
            o.setOrchidID(100L);
            return o;
        });

        Orchid input = new Orchid(null, "New Orchid", true, false, "Desc", "url", new OrchidCategory(1L, null));
        Orchid created = orchidService.createOrchid(input);

        assertNotNull(created);
        assertEquals(100L, created.getOrchidID());
        assertEquals("Cattleya", created.getOrchidCategory().getCategoryName());
        verify(categoryRepository, times(1)).findById(1L);
        verify(orchidRepository, times(1)).save(any(Orchid.class));
    }

    @Test
    void createOrchid_WhenNameIsBlank_ShouldThrowIllegalArgument() {
        Orchid input = new Orchid(null, "   ", true, false, "Desc", "url", new OrchidCategory(1L, null));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> orchidService.createOrchid(input));
        assertTrue(ex.getMessage().contains("orchidName"));
        verifyNoInteractions(categoryRepository);
        verifyNoInteractions(orchidRepository);
    }

    @Test
    void createOrchid_WhenCategoryMissing_ShouldThrowIllegalArgument() {
        Orchid input = new Orchid(null, "Valid Name", true, false, "Desc", "url", null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> orchidService.createOrchid(input));
        assertTrue(ex.getMessage().contains("categoryId"));
    }

    @Test
    void createOrchid_WhenCategoryNotFound_ShouldThrowIllegalArgument() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());
        Orchid input = new Orchid(null, "Valid Name", true, false, "Desc", "url", new OrchidCategory(999L, null));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> orchidService.createOrchid(input));
        assertTrue(ex.getMessage().contains("Category not found"));
    }

    @Test
    void deleteOrchid_WhenNotExists_ShouldThrowResourceNotFound() {
        when(orchidRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> orchidService.deleteOrchid(999L));
        verify(orchidRepository, never()).deleteById(anyLong());
    }
}
