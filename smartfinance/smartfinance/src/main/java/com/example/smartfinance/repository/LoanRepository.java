
package com.example.smartfinance.repository;

import com.example.smartfinance.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.math.BigDecimal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByCustomerId(Long customerId);


    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(l.principalAmount), 0) FROM Loan l")
    BigDecimal getTotalLoanAmount();

    @Query("SELECT COUNT(l) FROM Loan l WHERE l.status = :status")
    long countLoansByStatus(@Param("status") String status);
}


