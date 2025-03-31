import { Language, LanguageConfig } from './types';

export const LANGUAGES: Record<Language, LanguageConfig> = {
  he: {
    name: 'עברית',
    code: 'he'
  },
  en: {
    name: 'English',
    code: 'en'
  }
};

const translations = {
  he: {
    settings: 'הגדרות',
    currency: 'מטבע',
    defaultCurrency: 'מטבע ברירת מחדל',
    saveChanges: 'שמור שינויים',
    discardChanges: 'בטל שינויים',
    back: 'חזור',
    monthlyOverview: 'סקירה חודשית',
    totalSpent: 'סך ההוצאות',
    remainingBudget: 'תקציב נותר',
    remaining: 'נותר',
    ofBudget: 'מתוך התקציב',
    budgetUsed: 'שימוש בתקציב החודשי',
    createExpanse: 'צור הוצאה',
    noCategories: 'אין קטגוריות',
    selectCategories: 'בחר קטגוריות',
    selectCurrency: 'בחר מטבע',
    continue: 'המשך לדף הבית',
    monthlyOverviewTitle: 'סקירה חודשית',
    totalSpentTitle: 'סך ההוצאות',
    remainingBudgetTitle: 'תקציב נותר',
    remainingTitle: 'נותר',
    ofBudgetTitle: 'מתוך התקציב',
    budgetUsedTitle: 'שימוש בתקציב החודשי',
    createExpanseTitle: 'צור הוצאה',
    language: 'שפה',

  },
  en: {
    settings: 'Settings',
    currency: 'Currency',
    defaultCurrency: 'Default Currency',
    saveChanges: 'Save Changes',
    discardChanges: 'Discard Changes',
    back: 'Back',
    monthlyOverview: 'Monthly Overview',
    totalSpent: 'Total Spent',
    remainingBudget: 'Remaining Budget',
    remaining: 'Remaining',
    ofBudget: 'of budget',
    budgetUsed: 'of monthly budget used',
    createExpanse: 'Create Expanse',
    noCategories: 'No Categories',
    selectCategories: 'Select Categories',
    selectCurrency: 'Select Currency',
    continue: 'Continue to Dashboard',
    monthlyOverviewTitle: 'Monthly Overview',
    totalSpentTitle: 'Total Spent',
    remainingBudgetTitle: 'Remaining Budget',
    remainingTitle: 'Remaining',
    ofBudgetTitle: 'of budget',
    budgetUsedTitle: 'of monthly budget used',
    createExpanseTitle: 'Create Expanse',
    language: 'Language',
  }
};

export const getTranslation = (key: string, language: Language): string => {
  return translations[language][key as keyof typeof translations[Language]] || key;
}; 