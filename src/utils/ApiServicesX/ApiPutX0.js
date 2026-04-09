import apiUrl from "../ApiConfig";
import Swal from "sweetalert2";

const ApiPutX0 = (url, obj, func) => {
    async function myAppPost() {
        const res = await fetch(`${apiUrl}${url}`, {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json().then((result) => {
                        func(result)
                    });
                } else {
                    return res.json().then((result) => {

                        if (result.msg) {
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: result.msg,
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    });
                }
            })
            .catch((err) => console.log(err));
    }
    myAppPost();
};
export default ApiPutX0;
