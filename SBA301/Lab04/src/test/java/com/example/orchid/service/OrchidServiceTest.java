package com.example.orchid.service;

import com.example.orchid.pojos.Orchid;
import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.repositories.IOrchidCategoryRepository;
import com.example.orchid.repositories.IOrchidRepository;
import com.example.orchid.services.OrchidService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrchidServiceTest {

    @Mock
    private IOrchidRepository orchidRepository;

    @Mock
    private IOrchidCategoryRepository categoryRepository;

    @InjectMocks
    private OrchidService orchidService;

    private OrchidCategory category;
    private Orchid orchid;

    @BeforeEach
    void setUp() {
        category = new OrchidCategory(1L, "Dendrobium");
        orchid = new Orchid(1L, "Ceasar 4N", true, "Special orchid", category, true, "/images/ceasar.svg");
    }

    @Test
    @DisplayName("getAll should return list from repository")
    void getAll_ShouldReturnList() {
        when(orchidRepository.findAll()).thenReturn(List.of(orchid));

        List<Orchid> result = orchidService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOrchidName()).isEqualTo("Ceasar 4N");
        verify(orchidRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("searchByName with blank string should return all orchids")
    void searchByName_BlankKeyword_ShouldReturnAll() {
        when(orchidRepository.findAll()).thenReturn(List.of(orchid));

        List<Orchid> result = orchidService.searchByName("   ");

        assertThat(result).hasSize(1);
        verify(orchidRepository, times(1)).findAll();
        verify(orchidRepository, never()).findByOrchidNameContainingIgnoreCase(any());
    }

    @Test
    @DisplayName("searchByName with valid keyword should call derived query")
    void searchByName_ValidKeyword_ShouldCallRepository() {
        when(orchidRepository.findByOrchidNameContainingIgnoreCase("Ceasar")).thenReturn(List.of(orchid));

        List<Orchid> result = orchidService.searchByName("Ceasar");

        assertThat(result).hasSize(1);
        verify(orchidRepository, times(1)).findByOrchidNameContainingIgnoreCase("Ceasar");
    }

    @Test
    @DisplayName("getById should return orchid when found")
    void getById_Found_ShouldReturnOrchid() {
        when(orchidRepository.findById(1L)).thenReturn(Optional.of(orchid));

        Optional<Orchid> result = orchidService.getById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getOrchidName()).isEqualTo("Ceasar 4N");
    }

    @Test
    @DisplayName("create without orchidName should throw IllegalArgumentException")
    void create_MissingName_ShouldThrowException() {
        Orchid invalid = new Orchid(null, "", true, "desc", category, true, "url");

        assertThatThrownBy(() -> orchidService.create(invalid))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("orchidName is required");

        verify(orchidRepository, never()).save(any());
    }

    @Test
    @DisplayName("create without category should throw IllegalArgumentException")
    void create_MissingCategory_ShouldThrowException() {
        Orchid invalid = new Orchid(null, "Test Orchid", true, "desc", null, true, "url");

        assertThatThrownBy(() -> orchidService.create(invalid))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("categoryId is required");

        verify(orchidRepository, never()).save(any());
    }

    @Test
    @DisplayName("create with non-existent category should throw IllegalArgumentException")
    void create_NonExistentCategory_ShouldThrowException() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());
        Orchid invalid = new Orchid(null, "Test Orchid", true, "desc", new OrchidCategory(999L, "Fake"), true, "url");

        assertThatThrownBy(() -> orchidService.create(invalid))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category not found: 999");

        verify(orchidRepository, never()).save(any());
    }

    @Test
    @DisplayName("create with valid data should resolve category and save")
    void create_ValidData_ShouldSaveAndReturn() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(orchidRepository.save(any(Orchid.class))).thenAnswer(inv -> {
            Orchid arg = inv.getArgument(0);
            arg.setOrchidID(10L);
            return arg;
        });

        Orchid input = new Orchid(null, "New Orchid", true, "Fresh", new OrchidCategory(1L, null), true, "url");
        Orchid created = orchidService.create(input);

        assertThat(created.getOrchidID()).isEqualTo(10L);
        assertThat(created.getOrchidCategory()).isEqualTo(category);
        verify(orchidRepository, times(1)).save(input);
    }

    @Test
    @DisplayName("update with non-existent id should return empty")
    void update_NotFound_ShouldReturnEmpty() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(orchidRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Orchid> result = orchidService.update(99L, orchid);

        assertThat(result).isEmpty();
        verify(orchidRepository, never()).save(any());
    }

    @Test
    @DisplayName("update with valid data should update fields and save")
    void update_Valid_ShouldUpdateAndReturn() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(orchidRepository.findById(1L)).thenReturn(Optional.of(orchid));
        when(orchidRepository.save(any(Orchid.class))).thenAnswer(inv -> inv.getArgument(0));

        Orchid updateInput = new Orchid(null, "Updated Name", false, "New Desc", new OrchidCategory(1L, null), false, "new.jpg");
        Optional<Orchid> updated = orchidService.update(1L, updateInput);

        assertThat(updated).isPresent();
        assertThat(updated.get().getOrchidName()).isEqualTo("Updated Name");
        assertThat(updated.get().getIsNatural()).isFalse();
        verify(orchidRepository, times(1)).save(orchid);
    }

    @Test
    @DisplayName("delete with existing id should return true")
    void delete_Existing_ShouldReturnTrue() {
        when(orchidRepository.existsById(1L)).thenReturn(true);

        boolean deleted = orchidService.delete(1L);

        assertThat(deleted).isTrue();
        verify(orchidRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete with non-existent id should return false")
    void delete_Missing_ShouldReturnFalse() {
        when(orchidRepository.existsById(99L)).thenReturn(false);

        boolean deleted = orchidService.delete(99L);

        assertThat(deleted).isFalse();
        verify(orchidRepository, never()).deleteById(any());
    }
}
