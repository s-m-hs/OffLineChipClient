import AlertError from "./AlertFunc/AlertError";
import apiUrl from "./ApiConfig";

const ChangeUplodeD = (file, func1, options = {}) => {
    // تنظیمات پیش‌فرض
    const {
        allowedExtensions = null,  // آرایه پسوندهای مجاز مثل ['rar', 'zip']
        maxSizeMB = null,          // حداکثر سایز به مگابایت
        customValidation = null,   // تابع اعتبارسنجی سفارشی
        onError = null             // تابع خطاگیر سفارشی
    } = options;

    // اعتبارسنجی فرمت فایل
    if (allowedExtensions && allowedExtensions.length > 0) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            const errorMessage = `فرمت فایل مجاز نیست! فرمت‌های مجاز: ${allowedExtensions.join(', ')}`;
            AlertError(errorMessage);
            onError();

            return;
        }
    }

    // اعتبارسنجی سایز فایل
    if (maxSizeMB) {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            const errorMessage = `حجم فایل بیش از حد مجاز است! حداکثر حجم: ${maxSizeMB} مگابایت`;
            showError(errorMessage, onError);
            return;
        }
    }

    // اعتبارسنجی سفارشی
    if (customValidation && typeof customValidation === 'function') {
        const validationResult = customValidation(file);
        if (validationResult !== true) {
            showError(validationResult || 'اعتبارسنجی فایل با خطا مواجه شد', onError);
            return;
        }
    }

    // آپلود فایل
    let formData = new FormData();
    formData.append("File", file);
    formData.append("Name", "");
    formData.append("Description", "");
    formData.append("IsPrivate", true);

    async function myAppPostFile() {
        try {
            const res = await fetch(`${apiUrl}/api/CyFiles/upload`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const result = await res.json();
                if (result) {
                    func1(result.id);
                }
            } else {
                showError('خطا در آپلود فایل', onError);
            }
        } catch (err) {
            showError('خطا در ارتباط با سرور', onError);
        }
    }

    myAppPostFile();
};

// تابع کمکی برای نمایش خطا
const showError = (message, onError) => {
    if (onError && typeof onError === 'function') {
        onError(message);
    } else {
        alert(message);
    }
};

export default ChangeUplodeD