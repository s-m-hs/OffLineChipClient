const getRowClass = (params) => {
    const { levelOk, approvals } = params.data;

    if (!approvals || !Array.isArray(approvals)) return null;

    // general manager
    if (levelOk === 15) {
        const hasPendingGM = approvals.some(a =>
            a.roleName === "GeneralManager" &&
            a.isApproved === false
        );

        if (hasPendingGM) return "row-pending";
    }

    // department manager
    if (levelOk === 13) {
        const hasPendingDept = approvals.some(a =>
            a.roleName === "DepartmentManager" &&
            a.isApproved === false &&
            a.isFirst === true
        );

        if (hasPendingDept) return "row-pending";
    }

    return null;
};


export default getRowClass