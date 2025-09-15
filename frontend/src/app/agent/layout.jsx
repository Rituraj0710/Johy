import AgentSidebar from "@/components/AgentSidebar";
import FooterPage from "@/components/Footer";

const UserLayout = ({children}) => {
  return (
   <>
    <div className="grid grid-cols-12">
      <div className="col-span-2 h-screen">
        <AgentSidebar />
      </div>
      <div className="col-span-10 bg-gray-100 h-screen">{children}</div>
      
    </div>
    <FooterPage />
   </>
  )
}

export default UserLayout;