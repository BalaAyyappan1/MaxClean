import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  handleSignout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, handleSignout }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar handleSignout={handleSignout} />
      
      {/* Content area */}
      <div className="ml-64 w-full p-6">{children}</div>
    </div>
  );
};

export default Layout;