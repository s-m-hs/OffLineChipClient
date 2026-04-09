import Swal from "sweetalert2";
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
});


const AlertQ = (title1, title2, funcA) => {
    swalWithBootstrapButtons
        .fire({
            title: title1, //"آیا از حذف اطمینان دارید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله",
            cancelButtonText: "خیر ",
            reverseButtons: true,
        })
        .then((result) => {
            if (result.isConfirmed) {
                funcA()
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: title2,//"حذف انجام نشد",
                    icon: "error",
                });
            }
        });
}

export default AlertQ