
package com.example.smartfinance.service;

import com.example.smartfinance.dto.DashboardSummary;
import com.example.smartfinance.repository.CustomerRepository;
import com.example.smartfinance.repository.LoanRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final LoanRepository loanRepository;


    public DashboardService(
            CustomerRepository customerRepository,
            LoanRepository loanRepository) {
        this.customerRepository = customerRepository;
        this.loanRepository = loanRepository;

    }

    public DashboardSummary getSummary() {

        long totalCustomers = customerRepository.count();
        long totalLoans = loanRepository.count();

        long pendingLoans = loanRepository.countByStatus("PENDING");
        long approvedLoans = loanRepository.countByStatus("APPROVED");
        long rejectedLoans = loanRepository.countByStatus("REJECTED");

        BigDecimal totalLoanAmount =
                loanRepository.getTotalLoanAmount();


        return new DashboardSummary(
                totalCustomers,
                totalLoans,
                pendingLoans,
                approvedLoans,
                rejectedLoans,
                totalLoanAmount
        );
    }
}
