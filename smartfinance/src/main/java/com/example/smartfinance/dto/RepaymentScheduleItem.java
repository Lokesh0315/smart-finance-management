
package com.example.smartfinance.dto;

import java.math.BigDecimal;

public record RepaymentScheduleItem(
        int month,
        BigDecimal openingBalance,
        BigDecimal emi,
        BigDecimal interest,
        BigDecimal principal,
        BigDecimal closingBalance
) {
}
