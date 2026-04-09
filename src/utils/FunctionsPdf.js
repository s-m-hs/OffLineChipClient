import apiUrl from "./ApiConfig";

function fileUploadHandlerPdf(file, setImgUrlll) {
  // بررسی نوع فایل
  if (file.type !== "application/pdf") {
    alert("فقط فایل‌های PDF قابل آپلود هستند!");
    return;
  }

  let formData = new FormData();
  formData.append("File", file);
  formData.append("Name", "");
  formData.append("Description", "");
  formData.append("IsPrivate", false);

  async function myAppPostFile() {
    try {
      const res = await fetch(`${apiUrl}/api/CyFiles/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setImgUrlll(result.adress);
      } else {
        console.error("خطا در آپلود فایل", res);
      }
    } catch (err) {
      console.error("خطای سرور:", err);
    }
  }

  myAppPostFile();
}

export default fileUploadHandlerPdf;
