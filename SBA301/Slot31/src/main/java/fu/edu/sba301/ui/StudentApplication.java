package fu.edu.sba301.ui;

import fu.edu.sba301.slot31.dao.StudentDAO;
import fu.edu.sba301.slot31.repository.StudentRepository;
import fu.edu.sba301.slot31.service.IStudentService;
import fu.edu.sba301.slot31.service.StudentService;
import fu.edu.sba301.slot31.util.HibernateUtil;
import fu.edu.sba301.ui.controller.StudentController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.hibernate.SessionFactory;

import java.io.IOException;

public class StudentApplication extends Application {

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/fu/edu/sba301/ui/student-view.fxml")
        );
        Scene scene = new Scene(loader.load());

        // Composition root: wire Service layer into Controller
        SessionFactory sf = HibernateUtil.getSessionFactory();
        StudentDAO dao = new StudentDAO(sf);
        StudentRepository repo = new StudentRepository(dao);
        IStudentService service = new StudentService(repo);

        StudentController controller = loader.getController();
        controller.setStudentService(service);

        stage.setTitle("Student Management - JavaFX & Hibernate");
        stage.setScene(scene);
        stage.show();
    }

    @Override
    public void stop() throws Exception {
        HibernateUtil.shutdown();
        super.stop();
    }

    public static void main(String[] args) {
        launch(args);
    }
}