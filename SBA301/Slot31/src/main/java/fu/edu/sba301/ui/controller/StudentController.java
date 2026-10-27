package fu.edu.sba301.ui.controller;

import fu.edu.sba301.slot31.entity.Student;
import fu.edu.sba301.slot31.service.IStudentService;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

public class StudentController {

    @FXML private TextField txtEmail;
    @FXML private TextField txtFirstName;
    @FXML private TextField txtLastName;
    @FXML private TextField txtMarks;

    @FXML private Button btnCreate;
    @FXML private Button btnUpdate;
    @FXML private Button btnDelete;
    @FXML private Button btnClear;
    @FXML private Button btnRefresh;

    @FXML private TableView<Student> tblStudents;
    @FXML private TableColumn<Student, Long> colId;
    @FXML private TableColumn<Student, String> colEmail;
    @FXML private TableColumn<Student, String> colFirstName;
    @FXML private TableColumn<Student, String> colLastName;
    @FXML private TableColumn<Student, Double> colMarks;

    private final ObservableList<Student> data = FXCollections.observableArrayList();
    private IStudentService studentService;
    private Long selectedStudentId;

    public void setStudentService(IStudentService studentService) {
        // Dependency injected into Controller from outside - Controller DOES NOT know about Hibernate/DAO
        this.studentService = studentService;
        refreshTable();
    }

    @FXML
    private void initialize() {
        if (colId != null) colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        if (colEmail != null) colEmail.setCellValueFactory(new PropertyValueFactory<>("email"));
        if (colFirstName != null) colFirstName.setCellValueFactory(new PropertyValueFactory<>("firstName"));
        if (colLastName != null) colLastName.setCellValueFactory(new PropertyValueFactory<>("lastName"));
        if (colMarks != null) colMarks.setCellValueFactory(new PropertyValueFactory<>("marks"));

        if (tblStudents != null) {
            tblStudents.setItems(data);
            tblStudents.getSelectionModel().selectedItemProperty().addListener((obs, oldValue, selected) -> populateForm(selected));
        }
    }

    @FXML
    public void handleCreate() {
        try {
            Student input = readForm();
            studentService.create(input);
            refreshTable();
            clearForm();
            showInfo("Student created successfully!");
        } catch (IllegalArgumentException | IllegalStateException ex) {
            showError(ex.getMessage());
        } catch (Exception ex) {
            showError("Unable to create student: " + ex.getMessage());
        }
    }

    @FXML
    public void handleUpdate() {
        if (selectedStudentId == null) {
            showError("Select a student first");
            return;
        }
        try {
            Student input = readForm();
            input.setId(selectedStudentId);
            studentService.update(input);
            refreshTable();
            clearForm();
            showInfo("Student updated successfully!");
        } catch (IllegalArgumentException | IllegalStateException ex) {
            showError(ex.getMessage());
        } catch (Exception ex) {
            showError("Unable to update student: " + ex.getMessage());
        }
    }

    @FXML
    public void handleDelete() {
        if (selectedStudentId == null) {
            showError("Select a student first");
            return;
        }
        if (!confirm("Delete selected student?")) {
            return;
        }
        try {
            studentService.delete(selectedStudentId);
            refreshTable();
            clearForm();
            showInfo("Student deleted successfully!");
        } catch (Exception ex) {
            showError("Unable to delete student: " + ex.getMessage());
        }
    }

    @FXML
    public void handleClear() {
        clearForm();
    }

    @FXML
    public void handleRefresh() {
        refreshTable();
    }

    public void populateForm(Student s) {
        if (s == null) return;
        selectedStudentId = s.getId();
        if (txtEmail != null) txtEmail.setText(s.getEmail());
        if (txtFirstName != null) txtFirstName.setText(s.getFirstName());
        if (txtLastName != null) txtLastName.setText(s.getLastName());
        if (txtMarks != null) txtMarks.setText(Double.toString(s.getMarks()));
    }

    public void refreshTable() {
        if (studentService == null) return;
        data.setAll(studentService.getAll());
    }

    public void clearForm() {
        selectedStudentId = null;
        if (txtEmail != null) txtEmail.clear();
        if (txtFirstName != null) txtFirstName.clear();
        if (txtLastName != null) txtLastName.clear();
        if (txtMarks != null) txtMarks.clear();
        if (tblStudents != null) tblStudents.getSelectionModel().clearSelection();
        if (txtEmail != null) txtEmail.requestFocus();
    }

    public Student readForm() {
        String email = txtEmail != null ? txtEmail.getText().trim() : "";
        String first = txtFirstName != null ? txtFirstName.getText().trim() : "";
        String last = txtLastName != null ? txtLastName.getText().trim() : "";

        if (email.isBlank() || first.isBlank() || last.isBlank()) {
            throw new IllegalArgumentException("Email, first name and last name are required");
        }

        double marks;
        try {
            marks = Double.parseDouble(txtMarks != null ? txtMarks.getText().trim() : "0");
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Marks must be a valid number");
        }

        if (marks < 0.0 || marks > 10.0) {
            throw new IllegalArgumentException("Marks must be between 0 and 10");
        }

        return new Student(email, first, last, marks);
    }

    private void showInfo(String message) {
        try {
            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setHeaderText(null);
            alert.setContentText(message);
            alert.showAndWait();
        } catch (Throwable ignored) {
            System.out.println("[INFO] " + message);
        }
    }

    private void showError(String message) {
        try {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setHeaderText("Operation failed");
            alert.setContentText(message);
            alert.showAndWait();
        } catch (Throwable ignored) {
            System.err.println("[ERROR] " + message);
        }
    }

    private boolean confirm(String message) {
        try {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION, message, ButtonType.YES, ButtonType.NO);
            return alert.showAndWait().orElse(ButtonType.NO) == ButtonType.YES;
        } catch (Throwable ignored) {
            return true;
        }
    }

    public ObservableList<Student> getData() { return data; }
    public Long getSelectedStudentId() { return selectedStudentId; }
}