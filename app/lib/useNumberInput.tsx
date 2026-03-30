import { useCallback } from 'react';

export const useNumberInput = (min: number = 0) => {
  const formatValue = useCallback((value: string): string => {
    // Удаляем всё, кроме цифр
    let cleaned = value.replace(/[^\d]/g, '');
    
    if (cleaned === '') return '';
    
    // Удаляем ведущие нули
    cleaned = cleaned.replace(/^0+/, '');
    
    // Если после удаления нулей строка пустая (были только нули), возвращаем '0'
    if (cleaned === '') return '0';
    
    // Преобразуем в число и проверяем минимальное значение
    let num = parseInt(cleaned, 10);
    
    if (num < min) {
      num = min;
    }
    
    return num.toString();
  }, [min]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const rawValue = e.target.value;
    const formattedValue = formatValue(rawValue);
    
    // Обновляем значение в input
    e.target.value = formattedValue;
    
    // Вызываем внешний onChange с отформатированным значением
    onChange(formattedValue);
  }, [formatValue]);

  return {
    formatValue,
    handleChange,
  };
};