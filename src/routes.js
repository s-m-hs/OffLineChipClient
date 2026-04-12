
import IndexH from './pages/IndexH/IndexH'
import CmsIndex from './pages/CmsPages/CmsIndex/CmsIndex'
import CmsNUser from './pages/CmsPages/CmsNUser/CmsNUser'
import CmsMenu from './pages/CmsPages/CmsMenu/CmsMenu'
import ItemMenuB from './components/CmsComponents/ItemMenuB/ItemMenuB'
import CmsCategory from './pages/CmsPages/CmsCategory/CmsCategory'
import CmsSubject from './pages/CmsPages/CmsSubject/CmsSubject'
import CmsCustomer from './pages/CmsPages/CmsCustomer/CmsCustomer'
import ErrorPage from './components/ErrorPage/ErrorPage'
import Parameter from './pages/CmsPages/Parameter/Parameter'
import CmsSkin from './pages/CmsPages/CmsSkin/CmsSkin'
import CmsManufacturer from './pages/CmsPages/CmsManufacturer/CmsManufacturer'
import CmsProduct from './pages/CmsPages/CmsProduct/CmsProduct'
import CmsOrder from './pages/CmsPages/CmsOrder/CmsOrder'
import CmsCategoryB from './pages/CmsPages/CmsCategoryB/CmsCategoryB'
import UserEmail from './pages/CmsPages/UserEmail/UserEmail'
import EditorExamole from './EditorExamole'
import CmsWarranty from './pages/CmsPages/CmsWarranty/CmsWarranty'
import CmsRepairs from './pages/CmsPages/CmsRepairs/CmsRepairs'
import CmsTicket from './pages/CmsPages/CmsTicket/CmsTicket'
import CmsSystemAsembly from './pages/CmsPages/CmsSystemAsembly/CmsSystemAsembly'
import TestPage from './pages/CmsPages/Test/TestPage'
import CmsFactor from './pages/CmsPages/CmsFactor/CmsFactor'
import PCBLIst from './components/CmsComponents/OrderOffline/PCBLIst'
import PCBLIstB from './components/CmsComponents/OrderOffline/PCBLIstB'
import OrderLists from './components/CmsComponents/OrderOffline/OrderLists'
import OrderListsB from './components/CmsComponents/OrderOffline/OrderListsB'
import InquiryList from './components/CmsComponents/OrderOffline/InquiryList'
import InQueryListB from './components/CmsComponents/OrderOffline/InQueryListB'
import OrderKarPooshe from './components/CmsComponents/OrderKarPoosheh/OrderKarPooshe'
let routes = [

    { path: '/', element: <IndexH /> },
    { path: '/errorpage', element: <ErrorPage /> },
    { path: '*', element: <ErrorPage /> },


    {
        path: '/p-admin', element: <CmsIndex />,

        children: [
            { path: 'users', element: <CmsNUser /> },
            { path: 'menu', element: <CmsMenu /> },
            { path: 'menu/:id', element: <ItemMenuB /> },
            { path: 'category', element: <CmsCategory /> },
            { path: 'CmsSubject', element: <CmsSubject /> },
            { path: 'customer', element: <CmsCustomer /> },
            { path: 'parameter', element: <Parameter /> },
            { path: 'skin', element: <CmsSkin /> },
            { path: 'manufacturer', element: <CmsManufacturer /> },
            { path: 'product', element: <CmsProduct /> },
            { path: 'order', element: <CmsOrder /> },
            { path: 'categoryspecialty', element: <CmsCategoryB /> },
            { path: 'useremail', element: <UserEmail /> },
            { path: 'edii', element: <EditorExamole /> },
            { path: 'warranty', element: <CmsWarranty /> },
            { path: 'repairs', element: <CmsRepairs /> },
            { path: 'tickets', element: <CmsTicket /> },
            { path: 'assemblypc', element: <CmsSystemAsembly /> },
            { path: 'testpage', element: <TestPage /> },
            { path: "Factor", element: <CmsFactor /> },
            { path: "OrderLists", element: <OrderLists /> },
            { path: "PCBLIst", element: <PCBLIst /> },
            { path: "OrderListsB", element: <OrderListsB /> },
            { path: "KarPooshe", element: <OrderKarPooshe /> },
            { path: "PCBLIstB", element: <PCBLIstB /> },
            { path: "InquiryList", element: <InquiryList /> },
            { path: "InQueryListB", element: <InQueryListB /> },

        ]

    },


]


export default routes
