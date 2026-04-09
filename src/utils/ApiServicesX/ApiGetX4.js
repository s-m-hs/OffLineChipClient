import apiUrl from "../ApiConfig";

const ApiGetX4 = (url, func, funcB) => {
    async function myAppGet() {
        const res = await fetch(`${apiUrl}${url}`, {
            method: "GET",
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json().then((result) => func(result.msg));
                } else {
                    return res.json().then(result => funcB(result.msg))
                }
            })
            .catch((error) => console.log(error));
    }
    myAppGet();
};

export default ApiGetX4;
