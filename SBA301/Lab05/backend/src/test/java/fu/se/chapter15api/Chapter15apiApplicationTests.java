package fu.se.chapter15api;

import fu.se.chapter15api.pojos.Orchid;
import fu.se.chapter15api.repositories.IOrchidRepository;
import fu.se.chapter15api.services.IOrchidService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class Chapter15apiApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IOrchidService orchidService;

    @Autowired
    private IOrchidRepository orchidRepository;

    @Test
    void testContextLoads() {
        assertNotNull(orchidService);
        assertNotNull(orchidRepository);
    }

    @Test
    void testCrudOperationsViaService() {
        // Test Insert
        Orchid o = new Orchid(null, "Test Orchid", true, "Description", "Cattleya", true, "http://image.url");
        Orchid saved = orchidService.insertOrchid(o);
        assertNotNull(saved.getOrchidId());
        assertEquals("Test Orchid", saved.getOrchidName());

        // Test Get
        assertTrue(orchidService.getOrchidByID(saved.getOrchidId()).isPresent());

        // Test Update
        saved.setOrchidName("Updated Orchid");
        Orchid updated = orchidService.updateOrchid(saved.getOrchidId(), saved);
        assertEquals("Updated Orchid", updated.getOrchidName());

        // Test Delete
        orchidService.deleteOrchid(saved.getOrchidId());
        assertTrue(orchidService.getOrchidByID(saved.getOrchidId()).isEmpty());
    }

    @Test
    void testCorsHeaders() throws Exception {
        mockMvc.perform(options("/orchids/")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "PUT"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().exists("Access-Control-Allow-Methods"));
    }
}
