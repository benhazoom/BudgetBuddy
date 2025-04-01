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
    noCategories: 'אין תקציבים',
    selectCategories: 'בחר תקציבים',
    selectCurrency: 'בחר מטבע',
    continue: 'המשך',
    monthlyOverviewTitle: 'סקירה חודשית',
    totalSpentTitle: 'סך ההוצאות',
    remainingBudgetTitle: 'תקציב נותר',
    remainingTitle: 'נותר',
    ofBudgetTitle: 'מתוך התקציב',
    budgetUsedTitle: 'שימוש בתקציב החודשי',
    createExpanseTitle: 'צור הוצאה',
    language: 'שפה',
    mainItems: 'פריטים ראשיים',
    dashboard: 'לוח בקרה',
    expanses: 'הוצאות',
    budgets: 'תקציבים',
    budget: 'תקציב',
    spent: 'יצא',
    underBudget: 'מתחת לתקציב',
    overBudget: 'מעל התקציב',
    editBudget: 'ערוך תקציב',
    amount: 'סכום',
    cancel: 'ביטול',
    save: 'שמור',
    saving: 'שומר...',
    budgetSaved: 'התקציב נשמר בהצלחה',
    errorSavingBudget: 'שגיאה בשמירת התקציב',
    goal: 'יעד',
    name: 'שם',
    category: 'קטגוריה',
    welcomeToBudgetBuddy: 'ברוכים הבאים ל-BudgetBuddy',
    setupBudgetCategories: 'בוא נגדיר את קטגוריות התקציב שלך',
    selectPreferredCurrency: 'בחר את המטבע המועדף עליך',
    selectCategoriesToTrack: 'בחר את הקטגוריות שברצונך לעקוב אחריהן:',
    defaultBudget: 'תקציב ברירת מחדל',
    continueToDashboard: 'המשך לדף הבית',
    noCategoriesSelected: 'לא נבחרו קטגוריות, אנא בחר לפחות קטגוריה אחת כדי להמשיך',
    selectLanguage: 'בחר שפה',
    selectLanguageDescription: 'בחר את השפה המועדפת עליך',
      housing: 'דיור',
      groceries: 'מצרכים',
      transportation: 'תחבורה',
      healthInsurance: 'בריאות וביטוח',
      educationChildcare: 'חינוך וטיפול בילדים',
      savingsInvestments: 'חיסכון והשקעות',
      debtLoans: 'חובות והלוואות',
      householdMaintenance: 'בית ותחזוקה',
      entertainmentLeisure: 'בידור ופנאי',
      clothingPersonalCare: 'ביגוד וטיפול אישי',
      restaurants: 'מסעדות',
      charity: 'צדקה',
      categoryNameEmpty: 'שם התקציב לא יכול להיות ריק',
      categoryExists: 'התקציב כבר קיים',
      categoryAdded: 'התקציב נוסף בהצלחה!',
      errorAddingCategory: 'שגיאה בהוספת תקציב',
      categoryDeleted: 'התקציב נמחק בהצלחה',
      errorDeletingCategory: 'שגיאה במחיקת התקציב',
      errorFetchingData: 'שגיאה בטעינת הנתונים',
      errorFetchingInvoices: 'שגיאה בטעינת החשבוניות',
      errorFetchingBudgets: 'שגיאה בטעינת התקציבים',
      mustBeLoggedIn: 'עליך להתחבר כדי ליצור חשבונית',
      invoiceCreated: 'החשבונית נוצרה בהצלחה',
      errorCreatingInvoice: 'שגיאה:',
      errorFetchingCategories: 'שגיאה בטעינת התקציבים',
      categoryName: 'שם התקציב',

    addCategory: 'הוסף תקציב',
    filterBudget: 'סנן לפי תקציב',
    all: 'הכל',
    noExpansesFound: 'לא נמצאו הוצאות',
    editExpanse: 'ערוך הוצאה',
    update: 'עדכן',
    expanseDeleted: 'ההוצאה נמחקה בהצלחה',
    errorDeletingExpanse: 'שגיאה במחיקת ההוצאה',
    errorUpdatingExpanse: 'שגיאה בעדכון ההוצאה',
    expanseUpdated: 'ההוצאה עודכנה בהצלחה',
    errorFetchingExpanses: 'שגיאה בטעינת ההוצאות',
  },
  en: {
    continue: 'Continue',
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
    noCategories: 'No Budgets',
    selectCategories: 'Select Budgets',
    selectCurrency: 'Select Currency',
    monthlyOverviewTitle: 'Monthly Overview',
    totalSpentTitle: 'Total Spent',
    remainingBudgetTitle: 'Remaining Budget',
    remainingTitle: 'Remaining',
    ofBudgetTitle: 'of budget',
    budgetUsedTitle: 'of monthly budget used',
    createExpanseTitle: 'Create Expanse',
    language: 'Language',
    mainItems: 'Main Items',
    dashboard: 'Dashboard',
    expanses: 'Expanses',
    budgets: 'Budgets',
    budget: 'Budget',
    spent: 'Spent',
    underBudget: 'Under Budget',
    overBudget: 'Over Budget',
    editBudget: 'Edit Budget',
    amount: 'Amount',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    budgetSaved: 'Budget saved successfully',
    errorSavingBudget: 'Error saving budget',
    goal: 'Goal',
    edit: 'Edit',
    delete: 'Delete',
    name: 'Name',
    category: 'Category',
    welcomeToBudgetBuddy: 'Welcome to BudgetBuddy',
    setupBudgetCategories: "Let's set up your budget categories",
    selectPreferredCurrency: 'First, select your preferred currency',
    selectCategoriesToTrack: 'Select the categories you want to track:',
    defaultBudget: 'Default Budget',
    continueToDashboard: 'Continue to Dashboard',
    noCategoriesSelected: 'No categories selected, Please select at least one category to continue',
    selectLanguage: 'Select Language',
    selectLanguageDescription: 'Choose your preferred language',
      housing: 'Housing',
      groceries: 'Groceries',
      transportation: 'Transportation',
      healthInsurance: 'Health & Insurance',
      educationChildcare: 'Education & Childcare',
      savingsInvestments: 'Savings & Investments',
      debtLoans: 'Debt & Loans',
      householdMaintenance: 'Household & Maintenance',
      entertainmentLeisure: 'Entertainment & Leisure',
      clothingPersonalCare: 'Clothing & Personal Care',
      restaurants: 'Restaurants',
      charity: 'Charity (Tzedakah)',
      categoryNameEmpty: 'Budget name cannot be empty',
      categoryExists: 'Budget already exists',
      categoryAdded: 'Budget added successfully!',
      errorAddingCategory: 'Error adding budget',
      categoryDeleted: 'Budget deleted successfully',
      errorDeletingCategory: 'Error deleting budget',
      errorFetchingData: 'Error fetching data',
      errorFetchingInvoices: 'Failed to fetch invoices',
      errorFetchingBudgets: 'Failed to fetch budgets',
      mustBeLoggedIn: 'You must be logged in to create an invoice',
      invoiceCreated: 'Invoice created successfully',
      errorCreatingInvoice: 'Error:',
      errorFetchingCategories: 'Failed to fetch budgets',
      categoryName: 'Budget Name',
      addCategory: 'Add Budget',
    filterBudget: 'Filter by Budget',
    all: 'All',
    noExpansesFound: 'No expanses found',
    editExpanse: 'Edit Expanse',
    update: 'Update',
    expanseDeleted: 'Expanse deleted successfully',
    errorDeletingExpanse: 'Error deleting expanse',
    errorUpdatingExpanse: 'Error updating expanse',
    expanseUpdated: 'Expanse updated successfully',
    errorFetchingExpanses: 'Error fetching expanses',
  }
};

export const getTranslation = (key: string, language: Language): string => {
  return translations[language][key as keyof typeof translations[Language]] || key;
}; 