import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import logo2 from "./assets/logo2.png";
import {
  Home,
  Settings,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  BarChart2,
  Globe,
  Book,
  MessageCircle,
  FileText,
  PersonStanding,
  User,
  UserCheck,
  LogOut, // Icon for Logout
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const [role,setRole]=useState('');

  useEffect(()=>{
    if(localStorage.getItem('role')==='admin'){
      setRole('admin');
    }
    else{
      setRole('user');
    }
  },[navigate])

  // Toggle menu open/close
  const toggleMenu = (menu) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const sidebarItems = [
    {
      label: "Home",
      icon: <Home />,
      href: "/",
      subItems: [{ label: "Go to Dashboard", icon: <Home />, href: "/" }],
    },
    {
      label: "Administration Statistics",
      icon: <BarChart2 />,
      href: "/admin/statistics",
      subItems: [
        { label: "Stream Stats", icon: <FileText />, href: "/admin/stream" },
        { label: "Student Stats", icon: <FileText />, href: "/admin/student" },
        { label: "Admission Stats", icon: <FileText />, href: "/admin/admission" },
        { label: "Payment Stats", icon: <FileText />, href: "/admin/payment" },
      ],
    },
    {
      label: "Website Management",
      icon: <Globe />,
      href: "/website",
      subItems: [
        { label: "News/Notice", icon: <FileText />, href: "/website/news" },
        { label: "Slider", icon: <FileText />, href: "/website/slider" },
        { label: "Ticker", icon: <FileText />, href: "/website/ticker" },
        { label: "Faculty", icon: <FileText />, href: "/website/faculty" },
      ],
    },
    {
      label: "Library Management",
      icon: <Book />,
      href: "/library",
      subItems: [
        { label: "Total Inventory", icon: <FileText />, href: "/library/inventory" },
        { label: "Total Members", icon: <FileText />, href: "/library/member" },
        { label: "Fine Collection Stats", icon: <FileText />, href: "/library/fine" },
        { label: "Book Issued Stats", icon: <FileText />, href: "/library/bookissue" },
      ],
    },
    {
      label: "Student Management",
      icon: <User />,
      href: "/student",
      subItems: [
        { label: "Grades", icon: <FileText />, href: "/student/grades" },
        { label: "Attendance", icon: <FileText />, href: "/student/attendance" },
      ],
    },
    {
      label: "Grievances and Feedbacks",
      icon: <MessageCircle />,
      href: "/feedback",
      subItems: [
        { label: "Grievance Stats", icon: <FileText />, href: "/feedback/grievance" },
        { label: "Feedbacks Received", icon: <FileText />, href: "/feedback/feedback" },
        { label: "Inquiries Received", icon: <FileText />, href: "/feedback/inquiries" },
        { label: "Contact Us Submissions", icon: <FileText />, href: "/feedback/contact" },
      ],
    },
    {
      label: "Admin Panel",
      icon: <UserCheck />,
      href: "/admin/panel",
      subItems: [
        { label: "Go To Admin Panel", icon: <FileText />, href: "/admin/panel" },
      ],
    },
  ];

  const theme = {
    dark: {
      bg: "bg-black",
      text: "text-white",
      hover: "hover:bg-gray-800",
      border: "border-gray-700",
    },
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      hover: "hover:bg-gray-100",
      border: "border-gray-200",
    },
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <nav
      className={`
        ${currentTheme.bg} ${currentTheme.text}
        transition-all duration-300 min-h-screen
        border-r ${currentTheme.border}
        ${isExpanded ? "w-64" : "w-24"}
        flex flex-col justify-between
      `}
    >
      {/* Top section */}
      <div>
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center justify-center w-full">
            <img
              src={isDarkMode ? logo : logo2}
              alt="Logo"
              className="h-20 w-20"
            />
            {isExpanded && <h2 className="text-xl font-bold ml-2">IIITN</h2>}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${currentTheme.hover} p-2 rounded-lg ml-auto`}
          >
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <ul className="mt-8">
          {role==='admin' ? sidebarItems.map((item, index) => (
            <li key={index}>
              <div
                onClick={() => item.subItems && toggleMenu(item.label)}
                className={`${currentTheme.hover} cursor-pointer flex items-center p-4 transition-colors duration-200`}
              >
                {item.icon}
                {isExpanded && <span className="ml-4">{item.label}</span>}
              </div>
              {item.subItems && openMenus[item.label] && isExpanded && (
                <ul className="ml-8">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.href}
                        className={`${currentTheme.hover} cursor-pointer flex items-center p-2 transition-colors duration-200`}
                      >
                        {subItem.icon}
                        {isExpanded && <span className="ml-2">{subItem.label}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        :
        null}
        </ul>
      </div>

      {/* Theme toggle and Logout button at bottom */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`${currentTheme.hover} p-2 rounded-lg w-full flex items-center justify-center transition-colors duration-200`}
        >
          {isExpanded ? (
            <div className="flex items-center">
              {isDarkMode ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </div>
          ) : isDarkMode ? (
            <Sun />
          ) : (
            <Moon />
          )}
        </button>

        {/* Logout button */}
        {
          localStorage.getItem('id') ?  <button
          onClick={handleLogout}
          className={`${currentTheme.hover} p-2 rounded-lg w-full mt-2 flex items-center justify-center transition-colors duration-200`}
        >
          {isExpanded ? (
            <div className="flex items-center">
              <LogOut className="mr-2" />
              <span>Logout</span>
            </div>
          ) : (
            <LogOut />
          )}
        </button> : null
        }
       
      </div>
    </nav>
  );
};

export default Sidebar;
