const getRowClassB = (params) => {
    const { unitPrice } = params.data;

    if (unitPrice == 0) {
        return "row-pending"
    }

};


export default getRowClassB