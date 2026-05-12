import apiUrl from "../../ApiConfig";

const ApiGetC = (url, setFun, navig) => {
    async function myAppGet() {
        const res = await fetch(`${apiUrl}${url}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((result) => setFun(result))
            .catch((error) => console.log("errorpage"));
    }
    myAppGet();
};
export default ApiGetC;
