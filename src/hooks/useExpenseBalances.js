import { useMemo } from 'react';

/**
 * Custom hook for calculating expense balances
 * @param {Array} expenses - Array of expense objects
 * @param {Array} users - Array of user names
 * @returns {Object} Individual balances and simplified balances
 */
export const useExpenseBalances = (expenses, users) => {
  const balances = useMemo(() => {
    const balanceMap = {};
    users.forEach((user) => (balanceMap[user] = 0));

    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount) || 0;
      const participants = expense.participants.length || 1;
      const perPerson = amount / participants;

      // Person who paid gets credited
      balanceMap[expense.paidBy] = (balanceMap[expense.paidBy] || 0) + amount;

      // Participants owe their share
      expense.participants.forEach((participant) => {
        balanceMap[participant] = (balanceMap[participant] || 0) - perPerson;
      });
    });

    return balanceMap;
  }, [expenses, users]);

  const simplifiedBalances = useMemo(() => {
    const simplified = [];
    const balancesCopy = { ...balances };

    // Find who owes whom
    const creditors = Object.entries(balancesCopy)
      .filter(([_, balance]) => balance > 0.01)
      .sort((a, b) => b[1] - a[1]);

    const debtors = Object.entries(balancesCopy)
      .filter(([_, balance]) => balance < -0.01)
      .sort((a, b) => a[1] - b[1]);

    let creditorIdx = 0;
    let debtorIdx = 0;

    while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
      const [creditor, creditAmount] = creditors[creditorIdx];
      const [debtor, debtAmount] = debtors[debtorIdx];
      const debt = Math.abs(debtAmount);

      if (creditAmount >= debt) {
        simplified.push({
          from: debtor,
          to: creditor,
          amount: debt
        });
        creditors[creditorIdx][1] -= debt;
        debtorIdx++;
        if (creditors[creditorIdx][1] < 0.01) {
          creditorIdx++;
        }
      } else {
        simplified.push({
          from: debtor,
          to: creditor,
          amount: creditAmount
        });
        debtors[debtorIdx][1] += creditAmount;
        creditorIdx++;
      }
    }

    return simplified;
  }, [balances]);

  return { balances, simplifiedBalances };
};

