import React from 'react';
import * as Lucide from 'lucide-react';

// Import all recommended icons
const Icons = {
  // Dashboard & Stats
  BarChart3: Lucide.BarChart3,
  PieChart: Lucide.PieChart,
  TrendingUp: Lucide.TrendingUp,
  FileText: Lucide.FileText,
  
  // Waste Management
  Trash2: Lucide.Trash2,
  Package: Lucide.Package,
  Recycle: Lucide.Recycle,
  Box: Lucide.Box,
  Layers: Lucide.Layers,
  Thermometer: Lucide.Thermometer,
  SortAsc: Lucide.SortAsc,
  Grid: Lucide.Grid,
  List: Lucide.List,
  
  // Users & Departments
  Users: Lucide.Users,
  UserCheck: Lucide.UserCheck,
  Shield: Lucide.Shield,
  Building2: Lucide.Building2,
  MapPin: Lucide.MapPin,
  Phone: Lucide.Phone,
  Mail: Lucide.Mail,
  
  // Status & Process
  Clock: Lucide.Clock,
  CheckCircle: Lucide.CheckCircle,
  XCircle: Lucide.XCircle,
  AlertTriangle: Lucide.AlertTriangle,
  AlertCircle: Lucide.AlertCircle,
  Loader2: Lucide.Loader2,
  RefreshCw: Lucide.RefreshCw,
  
  // Forms & Actions
  PlusCircle: Lucide.PlusCircle,
  Edit: Lucide.Edit,
  Printer: Lucide.Printer,
  Download: Lucide.Download,
  Upload: Lucide.Upload,
  Trash2: Lucide.Trash2,
  
  // Navigation & Utilities
  Search: Lucide.Search,
  Filter: Lucide.Filter,
  Menu: Lucide.Menu,
  AlignJustify: Lucide.AlignJustify,
  ChevronLeft: Lucide.ChevronLeft,
  ChevronRight: Lucide.ChevronRight,
  ChevronsLeft: Lucide.ChevronsLeft,
  ChevronsRight: Lucide.ChevronsRight,
  Home: Lucide.Home,
  Settings: Lucide.Settings,
  LogOut: Lucide.LogOut,
  
  // Schedule & Location
  Calendar: Lucide.Calendar,
  MapPin: Lucide.MapPin,
  Building2: Lucide.Building2,
  
  // Export & Data
  FileText: Lucide.FileText,
  Download: Lucide.Download,
  Upload: Lucide.Upload,
  
  // Additional
  AlertTriangle: Lucide.AlertTriangle,
  Check: Lucide.Check,
  X: Lucide.X,
};

// Component wrapper for icons with consistent styling
const Icon = ({ 
  name, 
  size = 24, 
  className = '', 
  color = 'currentColor',
  strokeWidth = 2
}) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon '${name}' not found`);
    return null;
  }
  
  return (
    <IconComponent 
      size={size} 
      className={className}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default Icon;
export { Icons };