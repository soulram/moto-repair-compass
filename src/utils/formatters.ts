
/**
 * Formats a date string to a localized date format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a number with commas (e.g., 1,234)
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Determines if a warranty has expired
 */
export const isWarrantyExpired = (expiryDate: string | null): boolean => {
  if (!expiryDate) return true;
  
  try {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  } catch (error) {
    return true;
  }
};

/**
 * Determines the mileage status (e.g., if service is due soon)
 */
export const getMileageStatus = (
  currentMileage: number,
  nextServiceMileage: number
): "ok" | "warning" | "due" => {
  const difference = nextServiceMileage - currentMileage;
  
  if (difference <= 0) {
    return "due";
  } else if (difference <= 500) {
    return "warning";
  }
  
  return "ok";
};

/**
 * Formats a phone number to a consistent format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Generates a customer name display format
 */
export const formatCustomerName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

/**
 * Format a motorcycle description
 */
export const formatMotorcycle = (year: number, make: string, model: string): string => {
  return `${year} ${make} ${model}`;
};
