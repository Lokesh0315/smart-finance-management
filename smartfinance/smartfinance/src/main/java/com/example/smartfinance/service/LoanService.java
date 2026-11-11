
package com.example.smartfinance.service;

import com.example.smartfinance.entity.Customer;
import com.example.smartfinance.entity.Loan;
import com.example.smartfinance.repository.CustomerRepository;
import com.example.smartfinance.repository.LoanRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Set;

import com.example.smartfinance.dto.EmiRequest;
import com.example.smartfinance.dto.RepaymentScheduleItem;
import java.util.ArrayList;


@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;

    public LoanService(
            LoanRepository loanRepository,
            CustomerRepository customerRepository) {
        this.loanRepository = loanRepository;
        this.customerRepository = customerRepository;
    }

    private Customer getCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Customer not found"));
    }

    private BigDecimal calculateEmi(Loan loan) {
        BigDecimal principal = loan.getPrincipalAmount();
        BigDecimal annualRate = loan.getAnnualInterestRate();

        int months = loan.getTenureMonths();

        if (principal == null || principal.signum() <= 0
                || annualRate == null || annualRate.signum() < 0
                || months <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid loan details");
        }

        double p = principal.doubleValue();
        double r = annualRate.doubleValue() / 12.0 / 100.0;

        double emi;

        if (r == 0.0) {
            emi = p / months;
        } else {
            double power = Math.pow(1 + r, months);
            emi = p * r * power / (power - 1);
        }

        return BigDecimal.valueOf(emi)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public Loan createLoan(Loan loan) {
        if (loan.getCustomer() == null
                || loan.getCustomer().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Customer ID is required");
        }

        Customer customer = getCustomer(loan.getCustomer().getId());
        loan.setCustomer(customer);
        loan.setEmi(calculateEmi(loan));
        loan.setStatus("PENDING");

        return loanRepository.save(loan);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Loan not found"));
    }

    public List<Loan> getLoansByCustomer(Long customerId) {
        getCustomer(customerId);
        return loanRepository.findByCustomerId(customerId);
    }

    public Loan updateLoan(Long id, Loan updatedLoan) {
        Loan existing = getLoanById(id);

        if (updatedLoan.getCustomer() == null
                || updatedLoan.getCustomer().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Customer ID is required");
        }

        existing.setCustomer(
                getCustomer(updatedLoan.getCustomer().getId()));
        existing.setPrincipalAmount(updatedLoan.getPrincipalAmount());
        existing.setAnnualInterestRate(
                updatedLoan.getAnnualInterestRate());
        existing.setTenureMonths(updatedLoan.getTenureMonths());

        existing.setEmi(calculateEmi(existing));

        return loanRepository.save(existing);
    }

    public Loan updateStatus(Long id, String status) {
        Loan loan = getLoanById(id);

        Set<String> validStatuses =
                Set.of("PENDING", "APPROVED", "REJECTED");

        if (status == null
                || !validStatuses.contains(status.toUpperCase())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid loan status");
        }

        loan.setStatus(status.toUpperCase());
        return loanRepository.save(loan);
    }

    public void deleteLoan(Long id) {
        Loan loan = getLoanById(id);
        loanRepository.delete(loan);
    }




    public BigDecimal calculateEmi(EmiRequest request) {

        BigDecimal principal = request.getPrincipalAmount();
        BigDecimal annualRate = request.getAnnualInterestRate();
        int months = request.getTenureMonths();

        if (principal == null || principal.signum() <= 0
                || annualRate == null || annualRate.signum() < 0
                || months <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid EMI inputs");
        }

        double p = principal.doubleValue();
        double r = annualRate.doubleValue() / 1200.0;

        double result;

        if (r == 0.0) {
            result = p / months;
        } else {
            double power = Math.pow(1 + r, months);
            result = p * r * power / (power - 1);
        }

        return BigDecimal.valueOf(result)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public List<RepaymentScheduleItem> getRepaymentSchedule(Long loanId) {

        Loan loan = getLoanById(loanId);

        BigDecimal balance = loan.getPrincipalAmount()
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal monthlyRate = loan.getAnnualInterestRate()
                .divide(BigDecimal.valueOf(1200), 10,
                        RoundingMode.HALF_UP);

        BigDecimal monthlyEmi = loan.getEmi();
        if (monthlyEmi == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Loan EMI is not available");
        }

        List<RepaymentScheduleItem> schedule = new ArrayList<>();

        for (int month = 1; month <= loan.getTenureMonths(); month++) {

            BigDecimal openingBalance = balance;

            BigDecimal interest = openingBalance
                    .multiply(monthlyRate)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal payment = monthlyEmi;

            if (month == loan.getTenureMonths()) {
                payment = openingBalance.add(interest)
                        .setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal principalPaid = payment.subtract(interest)
                    .setScale(2, RoundingMode.HALF_UP);

            balance = openingBalance.subtract(principalPaid)
                    .setScale(2, RoundingMode.HALF_UP);

            if (balance.signum() < 0) {
                balance = BigDecimal.ZERO.setScale(2);
            }

            schedule.add(new RepaymentScheduleItem(
                    month,
                    openingBalance,
                    payment,
                    interest,
                    principalPaid,
                    balance
            ));
        }

        return schedule;
    }

}
