export const OrderStatusList
    = [
        { id: 1, status: "ثبت سفارش", statusId: 10 },
        { id: 2, status: "در حال استعلام گیری", statusId: 15 },
        { id: 3, status: "در انتظار تایید مشتری", statusId: 20 },
        { id: 4, status: "در صف خرید", statusId: 25 },
        { id: 5, status: "در حال تامین", statusId: 30 },
        { id: 6, status: "خاتمه یافته", statusId: 35 },
        { id: 8, status: "تحویل داده شده", statusId: 40 },
        { id: 9, status: "لغو شده", statusId: -1 },
    ];

export const PCBTypes = [
    { enumId: 1, typee: 'Gerber' },
    { enumId: 2, typee: 'StackLayer' },
    { enumId: 3, typee: 'MI' },
    { enumId: 4, typee: 'PickAndPlace' },
    { enumId: 5, typee: 'BOM' }
]

export const UserType = [
    { name: 'مدیربرنامه', userType: "SysAdmin", enum: 8 },
    { name: 'کارشناس گروه', userType: "GroupExpert", enum: 10 },///کارشناس گروه
    { name: 'مدیرگروه', userType: "GroupManager", enum: 12 },///مدیر گروه
    { name: 'مدیرواحد', userType: "DepartmentManager", enum: 13 },        /// مدیر واحد
    { name: 'مدیرکل', userType: "GeneralManager", enum: 15 },        /// مدیر کل
    { name: 'کارشناس خرید', userType: "PurchasingExpert", enum: 11 },  /// کارشناس خرید
    { name: 'مدیر خرید', userType: "PurchasingManager", enum: 14 },        /// مدیر خرید
    { name: 'ادمین پنل', userType: "CustomerAdmin", enum: 16 },///ادمین پنل
    { name: 'بازرس', userType: "Reporter", enum: 4 },///بازرس
    { name: 'تعیین نقش نشده', userType: "NewUser", enum: -1 }, /// تعیین نقش نشده 
    { name: 'همه', userType: "AllType", enum: 0 },
]

export const Currency = [
    { enumId: 1, currency: 'Yuan' },
    { enumId: 2, currency: 'Rial' },
    { enumId: 3, currency: 'Dolor' },

]

export const inSupplyStatus = [
    { id: 1, status: "در حال تامین" },
    { id: 2, status: "در حال ارسال" },
    { id: 3, status: "تحویل داده شده" },
]