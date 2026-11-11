
package com.example.smartfinance.dto;

import java.math.BigDecimal;

public record DashboardSummary(
        long totalCustomers,
        long totalLoans,
        long pendingLoans,
        long approvedLoans,
        long rejectedLoans,
        BigDecimal totalLoanAmount
) {
}
