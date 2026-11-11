
package com.example.smartfinance.controller;

import com.example.smartfinance.entity.Loan;
import com.example.smartfinance.service.LoanService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.example.smartfinance.dto.EmiRequest;
import com.example.smartfinance.dto.RepaymentScheduleItem;
import java.math.BigDecimal;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    public ResponseEntity<Loan> createLoan(
             @RequestBody Loan loan) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(loanService.createLoan(loan));
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Loan> getLoansByCustomer(
            @PathVariable Long customerId) {
        return loanService.getLoansByCustomer(customerId);
    }

    @PutMapping("/{id}")
    public Loan updateLoan(
            @PathVariable Long id,
            @RequestBody Loan loan) {
        return loanService.updateLoan(id, loan);
    }

    @PatchMapping("/{id}/status")
    public Loan updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return loanService.updateStatus(id, body.get("status"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(
            @PathVariable Long id) {
        loanService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/calculate-emi")
    public BigDecimal calculateEmi(
             @RequestBody EmiRequest request) {
        return loanService.calculateEmi(request);
    }

    @GetMapping("/{id}/schedule")
    public List<RepaymentScheduleItem> getRepaymentSchedule(
            @PathVariable Long id) {
        return loanService.getRepaymentSchedule(id);
    }

}
