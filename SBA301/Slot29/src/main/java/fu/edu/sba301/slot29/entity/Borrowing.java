package fu.edu.sba301.slot29.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "BORROWINGS")
public class Borrowing {

    public enum BorrowingStatus {
        ACTIVE, RETURNED, OVERDUE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id")
    private Book book;

    private LocalDate borrowedDate;
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private BorrowingStatus status;

    public Borrowing() {}

    public Borrowing(Student student, Book book, LocalDate borrowedDate, LocalDate dueDate, BorrowingStatus status) {
        this.student = student;
        this.book = book;
        this.borrowedDate = borrowedDate;
        this.dueDate = dueDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
    public LocalDate getBorrowedDate() { return borrowedDate; }
    public void setBorrowedDate(LocalDate borrowedDate) { this.borrowedDate = borrowedDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public BorrowingStatus getStatus() { return status; }
    public void setStatus(BorrowingStatus status) { this.status = status; }
}