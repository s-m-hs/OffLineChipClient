import apiUrl from "./ApiConfig";

function fileUploadHandler(file, setImgUrlll) {
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

export default fileUploadHandler;

// import apiUrl from "./ApiConfig";

//  function fileUploadHandler(file,setImgUrlll){

//     let formData = new FormData();
//     formData.append('File', file)
//     formData.append('Name', '')
//     formData.append('Description', '')
//     formData.append('IsPrivate', false)
//     async function myAppPostFile() {
//       const res = await fetch(`${apiUrl}/api/CyFiles/upload`, {
//         method: 'POST',
//         body: formData
//       }).then(res => {
//         console.log(res)
//         if(res.ok){
//       return res.json().then(
//         (result) => {
//          setImgUrlll(result.adress)
//         }
//       )
//         }
//       }).catch(err=>console.log(err))
//     }
//     myAppPostFile()
//   }

//   export default fileUploadHandler
