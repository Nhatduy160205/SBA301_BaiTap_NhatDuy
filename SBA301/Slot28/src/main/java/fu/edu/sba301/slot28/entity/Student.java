package fu.edu.sba301.slot28.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "STUDENTS")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    private double marks;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "STUDENTS_BOOKS",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private Set<Book> books = new HashSet<>();

    public Student() {}

    public Student(String email, String firstName, String lastName, double marks) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.marks = marks;
    }

    public void addBook(Book book) {
        books.add(book);
        if (org.hibernate.Hibernate.isInitialized(book.getStudents())) {
            book.getStudents().add(this);
        }
    }

    public void removeBook(Book book) {
        books.remove(book);
        if (org.hibernate.Hibernate.isInitialized(book.getStudents())) {
            book.getStudents().remove(this);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public double getMarks() { return marks; }
    public void setMarks(double marks) { this.marks = marks; }
    public Set<Book> getBooks() { return books; }
    public void setBooks(Set<Book> books) { this.books = books; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student student)) return false;
        return Objects.equals(email, student.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }

    @Override
    public String toString() {
        return "Student{" + "id=" + id + ", email='" + email + "', firstName='" + firstName + "', lastName='" + lastName + "', marks=" + marks + "}";
    }
}
