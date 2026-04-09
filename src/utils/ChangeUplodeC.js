import apiUrl from "./ApiConfig";


const ChangeUplodeC = (file, func1) => {
    // event.preventDefault()
    let formData = new FormData();
    formData.append("File", file);
    formData.append("Name", "");
    formData.append("Description", "");
    formData.append("IsPrivate", true);
    async function myAppPostFile() {
        const res = await fetch(`${apiUrl}/api/CyFiles/upload`, {
            method: "POST",

            body: formData,
        })
            .then((res) => {
                console.log(res)
                if (res.ok) {
                    return res.json().then((result) => {
                        if (result) {
                            console.log(result)
                            func1(result.id)
                        }
                    })
                }
            }).catch(err => console.log(err))
    }
    myAppPostFile();
};

export default ChangeUplodeC