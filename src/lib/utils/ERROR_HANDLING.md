# Error Handling Guide

این راهنما نحوه مدیریت خطاها در production را توضیح می‌دهد.

## اصول کلی

1. **هیچ console.error در production نمایش داده نمی‌شود**
2. **همه خطاها به صورت silent به error reporting service ارسال می‌شوند**
3. **کاربران فقط پیام‌های user-friendly می‌بینند**

## ساختار Error Handling

### 1. Error Logger (`errorLogger.js`)
- خطاها را به error reporting API ارسال می‌کند
- خطاها را در localStorage ذخیره می‌کند (آخرین 10 خطا)
- فقط در production فعال است

### 2. Error Handler (`errorHandler.js`)
- پیام‌های user-friendly تولید می‌کند
- Toast notifications نمایش می‌دهد
- Global error handlers را setup می‌کند

### 3. Error Boundary (`ErrorBoundary.jsx`)
- خطاهای React component را catch می‌کند
- Fallback UI نمایش می‌دهد
- خطاها را log می‌کند

### 4. Global Error Handler (`GlobalErrorHandler.jsx`)
- خطاهای unhandled را catch می‌کند
- Promise rejections را handle می‌کند
- Global JavaScript errors را handle می‌کند

## نحوه استفاده

### در API Calls

```javascript
import { handleApiError } from "@/lib/utils/errorHandler";

try {
    const data = await apiClient.get('/endpoint');
} catch (error) {
    handleApiError(error, {
        showToast: true,
        fallbackMessage: 'خطای سفارشی',
    });
}
```

### در Components

```javascript
import { logError } from "@/lib/utils/errorLogger";

try {
    // Some operation
} catch (error) {
    logError(error, {
        component: 'MyComponent',
        action: 'someAction',
    });
    // Show user-friendly message
}
```

### در Async Functions

```javascript
import { safeAsync } from "@/lib/utils/errorHandler";

const safeFunction = safeAsync(async (data) => {
    // Some async operation
    return result;
});

// Returns null on error instead of throwing
const result = await safeFunction(data);
```

## تنظیمات

### Error Reporting API

برای فعال کردن error reporting، متغیر محیطی زیر را تنظیم کنید:

```env
NEXT_PUBLIC_ERROR_REPORTING_API=https://your-api.com/errors
```

### بررسی خطاهای ذخیره شده

خطاها در localStorage با کلید `errorLogs` ذخیره می‌شوند:

```javascript
const errors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
```

## Best Practices

1. **همیشه از handleApiError استفاده کنید** برای API calls
2. **از logError استفاده کنید** برای خطاهای غیرمنتظره
3. **پیام‌های user-friendly نمایش دهید** به جای technical errors
4. **هیچ console.error در production نگذارید**
5. **خطاها را به error reporting service ارسال کنید**

## نکات مهم

- در production، هیچ console.error نمایش داده نمی‌شود
- همه خطاها به صورت silent log می‌شوند
- کاربران فقط پیام‌های user-friendly می‌بینند
- خطاها در localStorage ذخیره می‌شوند (آخرین 10 خطا)

