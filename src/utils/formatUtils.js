// src/utils/formatUtils.js

export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        amount = Number(amount) || 0;
    }
    
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
    }).format(amount).replace('₺', '').trim();
};