/**
 * @description 日期格式转换 yyyy:mm:dd
 */
export function formatDateToCustomFormat(dateString: string): string {  
  const date = new Date(dateString);  
  const year = date.getFullYear();  
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
  const day = String(date.getDate()).padStart(2, '0');  
  return `${year}:${month}:${day}`;  
} 
/**
 * @description 日期格式转换 Feb 29
 */
export function formatDate(dateString: string): string {  
  const date = new Date(dateString);  
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };  
  const formattedDate = date.toLocaleDateString('en-US', options);  
  return formattedDate;  
}  