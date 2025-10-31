import { useState, useCallback } from 'react';

// Define available routes in the application
const ROUTES = {
  DASHBOARD: 'dashboard',
  MY_REQUESTS: 'my-requests',
  NEW_REQUEST: 'new-request',
  REQUEST_DETAIL: 'request-detail',
  PROFILE: 'profile',
  SETTINGS: 'settings'
};

// Route configuration with metadata
const routeConfig = {
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    requiresAuth: true,
    showInNav: true,
    icon: 'dashboard'
  },
  [ROUTES.MY_REQUESTS]: {
    title: 'My Travel Requests',
    requiresAuth: true,
    showInNav: true,
    icon: 'requests'
  },
  [ROUTES.NEW_REQUEST]: {
    title: 'New Travel Request',
    requiresAuth: true,
    showInNav: true,
    icon: 'add'
  },
  [ROUTES.REQUEST_DETAIL]: {
    title: 'Request Details',
    requiresAuth: true,
    showInNav: false,
    icon: 'detail'
  },
  [ROUTES.PROFILE]: {
    title: 'My Profile',
    requiresAuth: true,
    showInNav: true,
    icon: 'profile'
  },
  [ROUTES.SETTINGS]: {
    title: 'Settings',
    requiresAuth: true,
    showInNav: true,
    icon: 'settings'
  }
};

export const useNavigation = (initialRoute = ROUTES.DASHBOARD) => {
  const [currentRoute, setCurrentRoute] = useState(initialRoute);
  const [routeParams, setRouteParams] = useState({});
  const [history, setHistory] = useState([{ route: initialRoute, params: {} }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to a new route
  const navigate = useCallback((route, params = {}) => {
    if (!ROUTES[route] && !Object.values(ROUTES).includes(route)) {
      console.error(`Invalid route: ${route}`);
      return;
    }

    const routeKey = Object.keys(ROUTES).find(key => ROUTES[key] === route) || route;

    setCurrentRoute(route);
    setRouteParams(params);
    
    // Add to history (remove forward history if we're not at the end)
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({ route, params });
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  // Navigate back
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const { route, params } = history[newIndex];
      
      setCurrentIndex(newIndex);
      setCurrentRoute(route);
      setRouteParams(params);
      return true;
    }
    return false;
  }, [currentIndex, history]);

  // Navigate forward
  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const { route, params } = history[newIndex];
      
      setCurrentIndex(newIndex);
      setCurrentRoute(route);
      setRouteParams(params);
      return true;
    }
    return false;
  }, [currentIndex, history]);

  // Check if can go back/forward
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  // Get current route configuration
  const getCurrentRouteConfig = () => {
    return routeConfig[currentRoute] || { title: 'Unknown Route' };
  };

  // Get route title
  const getRouteTitle = (route = null) => {
    const targetRoute = route || currentRoute;
    return routeConfig[targetRoute]?.title || 'Unknown Route';
  };

  // Check if route requires authentication
  const requiresAuth = (route = null) => {
    const targetRoute = route || currentRoute;
    return routeConfig[targetRoute]?.requiresAuth || false;
  };

  // Get navigation items for sidebar/menu
  const getNavigationItems = () => {
    return Object.entries(ROUTES)
      .filter(([key]) => routeConfig[ROUTES[key]]?.showInNav)
      .map(([key, value]) => ({
        key,
        route: value,
        title: routeConfig[value]?.title,
        icon: routeConfig[value]?.icon,
        isActive: currentRoute === value
      }));
  };

  // Reset navigation to initial state
  const resetNavigation = useCallback(() => {
    setCurrentRoute(initialRoute);
    setRouteParams({});
    setHistory([{ route: initialRoute, params: {} }]);
    setCurrentIndex(0);
  }, [initialRoute]);

  // Navigate to request detail with ID
  const navigateToRequestDetail = useCallback((requestId) => {
    navigate(ROUTES.REQUEST_DETAIL, { requestId });
  }, [navigate]);

  // Navigate to edit request
  const navigateToEditRequest = useCallback((requestId) => {
    navigate(ROUTES.NEW_REQUEST, { editMode: true, requestId });
  }, [navigate]);

  return {
    // State
    currentRoute,
    routeParams,
    history,
    currentIndex,
    
    // Navigation actions
    navigate,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    resetNavigation,
    
    // Route-specific navigation
    navigateToRequestDetail,
    navigateToEditRequest,
    
    // Route information
    getCurrentRouteConfig,
    getRouteTitle,
    requiresAuth,
    getNavigationItems,
    
    // Constants
    ROUTES
  };
};

export default useNavigation;